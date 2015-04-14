app.controller('LoginStateController', function ($scope, sessionProperties){
	$scope.loggedInUser = function () {
	  	return sessionProperties.get().user;
	};
	$scope.activeSession = function () {
		return sessionProperties.get().sessionKey ? true : false;
	};
});