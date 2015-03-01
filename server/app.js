/*****************************************
Load app config and logging settings, 
session manager and datasource manager
/****************************************/
var settings 	= require("./settings.js");
var sessions 	= require("./sessions.js");
var connections	= require('./connections.js')

/***********************************************************
Start the socket
***********************************************************/
var io = require('socket.io').listen(nconf.get('app:port'));
logger.info("SocketBI server listening on port " +nconf.get('app:port'));

/*************************************************
Receive initial connection request and open socket
Note: No authentication required at this point
TODO: Clean unused sockets
*************************************************/
io.on('connection', function (socket) {
	logger.debug('client connection');
	
/*************************************************
AUTHENTICATION
*************************************************/
	socket.on('auth', function(authdata) {
		// If username and password are not recognised then fail authentication
		// Notify socket and return
		if (!sessions.authenticateUser(authdata)) { 
			socket.emit('auth','failed');
			return;
		} 
		// If user is authenticated then add new session to sessions array
		var sessionStringEncrypted = sessions.newSession(authdata);
		// logger.debug(sessionStringEncrypted);
		// Send session key back in auth message
		socket.emit('auth',sessionStringEncrypted);
		logger.debug(""+sessionStore.length + " session" +(sessionStore.length>1?"s":""));
	});

	/********************************************
	Provide a list of databases that can be used 
	for a client to query against
	********************************************/
	socket.on('dblist', function (request) {
		logger.debug('dblist');
		// If this session key is not valid then fail data response
		if (sessions.activeSession(sessionStore,request.key) < 0) {
			logger.warn('unauthorised dblist request from ' +socket.handshake.address);
			socket.emit('dblist','failed');
			return;
		}
		// Get list of DBs and return to socket
		connections.dblist(function(err, result) {
			socket.emit('dblist',result);
		});
	});

	/********************************************
	Handle data requests
	Returns a dataresponse object to the socket 
	containing the originating queryid and the result
	********************************************/
	socket.on('datarequest', function (request) {
		logger.debug('datarequest: '+JSON.stringify(request));
		// If this session key is not valid then fail data response
		if (sessions.activeSession(sessionStore,request.key) < 0) {
			logger.warn('unauthorised data request from ' +socket.handshake.address);
			socket.emit('dataresponse',{"queryid":request.data.queryid,"result":'failed'});
			return;
		}
		// check what type of datasource this query is accessing
		var indexOfDataSource = cfg.datasources.map(function(e) { return e.name; }).indexOf(request.data.dataSourceName);
		var targetDSType = cfg.datasources[indexOfDataSource].type;
		logger.debug("targetDSType: " +targetDSType);
		switch(targetDSType) {
			case "mysql":
				// Run the query and send result on socket
				connections.mysql.query(request.data, function(err, result) {
					if(err) {
						logger.debug("Query error: " +result);
						socket.emit('dataresponse',{"queryid":request.data.queryid,"result":result});
						return;
					}
					socket.emit('dataresponse',{"queryid":request.data.queryid,"result":result});
				}); 
				break;
			default:
				logger.debug("Datasource config error");
				socket.emit('dataresponse',{"queryid":request.data.queryid,"error":"Datasource config error","result":""});
				break;
		}
	});

	socket.on('disconnect', function () { });
});

/************************************************************/
