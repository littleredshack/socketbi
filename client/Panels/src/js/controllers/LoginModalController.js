// LoginModalController.js

app.controller('LoginController', function ($scope, UsersApi) {

  this.cancel = $scope.$dismiss;

  this.submit = function (email, password) {
    UsersApi.login(email, password).then(function (user) {
      $scope.$close(user);
    });
  };

});