var SOCKETBI = SOCKETBI || {};

var socket = io('localhost:3080');

socket.on('connect', function () {
	console.log('connected');		
});

socket.on('auth', function (data) {
	// If authentication failed
	if (data == 'failed') {
		console.log(data);
		return;
	}
	// If authentication successful then store session key
	console.log("auth successful " +data);
	sessionStorage.sessionKey = data;
});

socket.on('dataresponse', function (data) {
	console.log(data);
});

SOCKETBI.login = function (creds) {
	socket.emit('auth', {'user':creds.user,'password':creds.password});
	// expect to get back an auth message in response containing a session token
	// client needs to send the session token as 'key' in all subsequent messages to server
}

SOCKETBI.datarequest = function(request) {
	console.log(request);
	socket.emit('datarequest', {'key':sessionStorage.sessionKey,'data':request});
}

