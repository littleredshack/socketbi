app.directive('loginButton', function ($modal, sessionProperties) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('click', function () {
        if (sessionProperties.get().sessionKey) {
          sessionProperties.set('sessionKey',null);
          sessionProperties.set('user',null);
          scope.$apply();
          return;
        }
        if (!sessionProperties.get().sessionKey) {
          var modalInstance = $modal.open({
            templateUrl: 'views/loginModalTemplate.html',
            controller: 'LoginFormController',
            size: 'sm'
          });
         }
      });
    }
  }
});