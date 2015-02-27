SOCKETBI = {};

SOCKETBI.socket = io('localhost:3080');

SOCKETBI.socket.on('connect', function () {
	console.log('connected');
	SOCKETBI.connected = true;
});

SOCKETBI.socket.on('auth', function (data) {
	// If authentication failed
	if (data == 'failed') {
		console.log(data);
		return;
	}
	// If authentication successful then store session key
	console.log("auth successful " +data);
	SOCKETBI.sessionKey = data;
	sessionStorage.sessionKey = data;
});

SOCKETBI.socket.on('dataresponse', function (data) {
	console.log(data);
	var evt = document.createEvent("Event");
	evt.initEvent("SOCKETBI.dataresponse",true,true);
	evt.data = data;
	document.dispatchEvent(evt);
});

SOCKETBI.socket.on('dblist', function (data) {
	SOCKETBI.dblist = data;
	var evt = document.createEvent("Event");
	evt.initEvent("SOCKETBI.dbList",true,true);
	evt.data = data;
	document.dispatchEvent(evt);
});

SOCKETBI.login = function (creds) {
	SOCKETBI.socket.emit('auth', {'user':creds.user,'password':creds.password});
	// expect to get back an auth message in response containing a session token
	// client needs to send the session token as 'key' in all subsequent messages to server
}

SOCKETBI.datarequest = function(request) {
	console.log(request);
	SOCKETBI.socket.emit('datarequest', {'key':sessionStorage.sessionKey,'data':request});
}

SOCKETBI.getDBList = function() {
	SOCKETBI.socket.emit('dblist', {'key':sessionStorage.sessionKey});
}
