/*****************************************
Load app config and logging settings, 
session manager and connection manager
/****************************************/
var settings = require("./settings.js");
var sessions = require("./sessions.js");
var connections = require('./connections.js')

/***********************************************************/

/***********************************************************/
var io = require('socket.io').listen(nconf.get('app:port'));
logger.info("SocketBI server listening on port " +nconf.get('app:port'));

/*************************************************
Receive initial connection request and open socket
Note: No authentication required at this point
*************************************************/
io.on('connection', function (socket) {
	logger.debug('connection');
	
/*************************************************
AUTHENTICATION
*************************************************/
	socket.on('auth', function(authdata) {
		// If username and password are not recognised then fail authentication and return
		if (!sessions.authenticateUser(authdata)) { 
			socket.emit('auth','failed');
			return;
		} 
		// If user is authenticated then add new session to sessions array
		var sessionStringEncrypted = sessions.newSession(secret,authdata);
		// Send session key back in auth message
		socket.emit('auth',sessionStringEncrypted);
		logger.debug(sessionStore);
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
		connections.dblist('datasources.json', function(err, result) {
			socket.emit('dblist',result);
		});
	});

	/********************************************
	Handle data requests
	********************************************/
	socket.on('datarequest', function (request) {
		logger.debug('datarequest: '+JSON.stringify(request));
		// If this session key is not valid then fail data response
		if (sessions.activeSession(sessionStore,request.key) < 0) {
			logger.warn('unauthorised data request from ' +socket.handshake.address);
			socket.emit('dataresponse','failed');
			return;
		}
		// Check for illegal SQL statements and return immediately if there are any
		var qx = request.data.query.toUpperCase();
		var found = qx.match(/DELETE|INSERT|UPDATE/g); 
		if( found ) {
			logger.warn("Illegal query from " +socket.handshake.address);
			socket.emit("dataresponse","Illegal query")
			return;
		}
		// Run the query and return result on socket
		connections.db1.query(request.data.query)
            .on('result', function(dbresponse){
            	logger.debug(dbresponse);
                socket.emit('dataresponse',dbresponse);
            })
            .on('end', function(){
                logger.debug("DB END");
            })
	});

	socket.on('disconnect', function () { });
});

/************************************************************/
