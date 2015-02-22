/**************************************************************/
// Setup to use nconf for application config
var fs    = require('fs'),
    path  = require('path'),
	nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Setup nconf to use the 'file' store
nconf.use('file', { file: path.join(__dirname, 'config.json') });

// Provide default values for settings not provided above.
nconf.defaults({
    'app': {
        'port': 3080,
		'secret': 'secret'
    }
});

/************************************************************/
// Set up logging
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: nconf.get('app:logging:console:loglevel') }),
      new (winston.transports.File)({ filename: nconf.get('app:logging:file:filename'), level: nconf.get('app:logging:file:loglevel') , json: false})
    ]
  });
  
/**************************************************************/

/*************************************************************/
// Use nconf.get to get settings
var secret = nconf.get('app:secret');

// Show the entire app config object from nconf
logger.debug('Settings: \n' + JSON.stringify(nconf.get('app'),null, 3));

var Sessions = require("./sessions.js");
var Connections = require('./connections.js')
var mysql = require('mysql')

var createDBConnection = function(dbname) {
	logger.debug("createDBConnection " +dbname);
 	var db = mysql.createConnection({
    	host: nconf.get('databases:'+dbname+':host'),
    	user: nconf.get('databases:'+dbname+':user'),
    	password: nconf.get('databases:'+dbname+':password'),
    	database: nconf.get('databases:'+dbname+':database')
	});
	return db;
}

var db1 = createDBConnection("mysql1");
/***********************************************************/

/***********************************************************/
var io = require('socket.io').listen(nconf.get('app:port'));
logger.info("SocketBI server listening on port " +nconf.get('app:port'));

io.on('connection', function (socket) {
	logger.debug('connection');
	
	socket.on('auth', function(authdata) {
		// If username and password are not recognised then fail authentication and return
		if (!Sessions.authenticateUser(authdata)) { 
			socket.emit('auth','failed');
			return;
		} 
		// If user is authenticated then add new session to sessions array
		var sessionStringEncrypted = Sessions.newSession(secret,authdata);
		// Send session key back in auth message
		socket.emit('auth',sessionStringEncrypted);
		logger.debug(sessions);
	});

	/********************************************
	Provide a list of databases that can be used 
	for a client to query against
	********************************************/
	socket.on('dblist', function (request) {
		logger.debug('dblist');
		// If this session key is not valid then fail data response
		if (Sessions.activeSession(sessions,request.key) < 0) {
			logger.warn('unauthorised dblist request from ' +socket.handshake.address);
			socket.emit('dblist','failed');
			return;
		}
		// Get list of DBs and return to socket
		Connections.readConfig('config.json', function(c){
			var dblist = [];
			c.dbs.forEach(function(entry){
				dblist.push(entry.name);
			});
        	socket.emit('dblist',dblist);
		})
	});

	socket.on('datarequest', function (request) {
		logger.debug('datarequest: '+JSON.stringify(request));
		// If this session key is not valid then fail data response
		if (Sessions.activeSession(sessions,request.key) < 0) {
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
		db1.query(request.data.query)
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
