app.directive('dockButton', function ( ) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      scope.$watch('docked', function(docked) {
        var menu = angular.element("#menu");
        if(!docked) {
          menu.draggable("disable",true)
          .resizable("disable",true)
          .css({top: 0, left: 0, position:'absolute', 'width':'100%', 'height':'40px'})
          .addClass("docked");
          return;
        }
        menu.draggable("enable")
        .resizable("enable")
        .removeClass("docked")
        .css({top: 100, left: 0, position:'absolute', 'width':'108px', 'height':'255px'});
      });
    }
  }
});