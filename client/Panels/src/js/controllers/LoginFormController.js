app.controller('LoginFormController', function ($scope, $modalInstance, socketbi, sessionProperties) {

  $scope.submit = function (email,pwd) {
  	sessionProperties.set('user',email);
    socketbi.emit('auth', {'user':email,'password':pwd});
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});