// Array Remove - By John Resig (MIT Licensed)
// http://ejohn.org/blog/javascript-array-remove/
var removeArrayItem = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// Keep a list of authenticated session keys
global.sessionStore = [];

global.users = [
	{"username":"glen","password":"password"},
	{"username":"chris","password":"password"}
]

exports.authenticateUser = function(userData) {
	logger.debug(userData);
// Get index of this username in users array
	var uIndex = users.map(function(e) { return e.username; }).indexOf(userData.user) ;
// Check if the passwords match
if (users[uIndex].password == userData.password) 
	return true 
else 
	return false;
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
	logger.debug("sesid: " +sesid);
	// If user already has a session then remove the user session from the array if
	// so each user can only have one session at a time
	if(sesid >= 0) removeArrayItem(sessionStore,sesid);
	// Add the user and session key to the array
	sessionStore.push({"user":authData.user,"key":sessionStringEncrypted});
	logger.debug(sessionStore,1,3);
	return sessionStringEncrypted;
}

