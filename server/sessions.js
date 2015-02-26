global.sessionStore = [];

exports.authenticateUser = function(userData) {
// if (userData.user == 'glen' && userData.password=='password') 
	return true 
//else 
//	return false;
}

var sessionID = function (sessionArray,user) {
// Returns the array index of a logged in a user or -1
	return sessionArray.map(function(e) { return e.user; }).indexOf(user) ;
}

exports.activeSession = function (sessionArray,sessionKey) {
// Returns the array index of a session key or -1
	return sessionArray.map(function(e) { return e.key; }).indexOf(sessionKey) ;
}

exports.newSession = function (secret,authData) {
// returns encrypted session identifier

	// Nodejs encryption with CTR
	var crypto = require('crypto'),
	    algorithm = 'aes-256-ctr',
	    password = secret;
	 
	function encrypt(text){
		return crypto.createHash("md5").update(text).digest("hex");
	}

	// Use authdata, app secret and datetime to calculate a unique session key
	var d = new Date();
	var sessionString = authData.user+authData.password+secret+d.getTime();
	var sessionStringEncrypted = encrypt(sessionString);
	var sesid = sessionID(sessionStore,authData.user);
	// logger.debug(sesid<0?"New session":"Replacing session")
	// Remove the user session from the array if they already have one so each user can only have one session at a time
	sessionStore.splice(sesid,1);
	// Add the user and session key to the array
	sessionStore.push({"user":authData.user,"key":sessionStringEncrypted});
	return sessionStringEncrypted;
}

