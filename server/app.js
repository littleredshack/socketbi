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

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = secret;
 
function encrypt(text){
	return crypto.createHash("md5").update(text).digest("hex");
}

function authenticateUser(userData) {
if (userData.user == 'glen' && userData.password=='password') 
	return true 
else 
	return false;
}

function sessionID(sessionArray,user) {
// Returns the array index of a logged in a user or -1
	return sessionArray.map(function(e) { return e.user; }).indexOf(user) ;
}

function activeSession(sessionArray,sessionKey) {
// Returns the array index of a session key or -1
	return sessionArray.map(function(e) { return e.key; }).indexOf(sessionKey) ;
}

function newSession(authData) {
// returns encrypted session identifier
	// Use authdata, app secret and datetime to calculate a unique session key
	var d = new Date();
	var sessionString = authData.user+authData.password+secret+d.getTime();
	var sessionStringEncrypted = encrypt(sessionString);
	var sesid = sessionID(sessions,authData.user);
	logger.debug(sesid<0?"New session":"Replacing session")
	// Remove the user session from the array if they already have one so each user can only have one session at a time
	sessions.splice(sesid,1);
	// Add the user and session key to the array
	sessions.push({"user":authData.user,"key":sessionStringEncrypted});
	return sessionStringEncrypted;
}

var sessions = [];
/***********************************************************/

/***********************************************************/
var mysql = require('mysql')
// Define our db creds

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
		if (!authenticateUser(authdata)) { 
			socket.emit('auth','failed');
			return;
		} 
		// If user is authenticated then add new session to sessions array
		var sessionStringEncrypted = newSession(authdata);
		// Send session key back in auth message
		socket.emit('auth',sessionStringEncrypted);
		logger.debug(sessions);
	});
	
	socket.on('datarequest', function (request) {
		logger.debug('datarequest'+JSON.stringify(request));
		// If this session key is not valid then fail data response
		if (activeSession(sessions,request.key) < 0) {
			logger.warn('unauthorised data request from ' +socket.handshake.address);
			socket.emit('dataresponse','failed');
			return;
		}
		// Check for illegal SQL statements and exit if there are any
		var qx = request.data.query.toUpperCase();
		if(!qx.match('/DELETE|INSERT/UPDATE/g')) {
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
