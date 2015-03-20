app.directive('dockButton', function ( ) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      scope.$watch('docked', function(value) {
        if(!value) {
          angular.element("#2").draggable("disable",true);
          angular.element("#2").resizable("disable",true);
          angular.element("#2").css({top: 0, left: 0, position:'absolute', 'width':'100%', 'height':'55px'});
          angular.element("#2").addClass("menu-docked");
          return;
        }
        angular.element("#2").draggable("enable");
        angular.element("#2").resizable("enable");
        angular.element("#2").removeClass("menu-docked");
        angular.element("#2").css({top: 100, left: 0, position:'absolute', 'width':'125px', 'height':'255px'});
      });
    }
  }
});