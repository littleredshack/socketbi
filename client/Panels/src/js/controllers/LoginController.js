app.controller('LoginController', function($scope, ModalService) {

  $scope.showLoginModal = function() {
    console.log("click");

    // Just provide a template url, a controller and call 'showModal'.
    ModalService.showModal({
      templateUrl: "views/loginModalTemplate.html",
      controller: "YesNoController"
    }).then(function(modal) {
      // The modal object has the element built, if this is a bootstrap modal
      // you can call 'modal' to show it, if it's a custom modal just show or hide
      // it as you need to.
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.message = result ? "You said Yes" : "You said No";
      });
    });

  };

});