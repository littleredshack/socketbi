var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('myCtrl', function ($http, $scope) {
  $scope.someObject = [];
  $scope.someFunction = function () {
      console.log('Resized !');
  };
});


app.directive('mypanel', function () {
    return {
        restrict: 'A',
        scope: {
            id: '@',
            myAttribute: '=',
            callback: '&onResizeStop'
        },
        link: function (scope, elem, attrs) {
            scope.myAttribute[scope.id] = scope.myAttribute[scope.id] || {};
            scope.myAttribute[scope.id].id = scope.id;
            // quirky thing with jQuery resize-handles
            // http://stackoverflow.com/questions/4673398/jquery-resizable-handle-z-index
            delete $.ui.resizable.prototype.options.zIndex;
            elem.addClass("panel panel-default");
            elem.draggable({
              stack: '.panel',
              containment: '#container', 
              drag: function(evt,ui) {
                scope.myAttribute[scope.id].position = scope.myAttribute[scope.id].position || {};
                scope.myAttribute[scope.id].position.offsetTop = ui.offset.top;
                scope.myAttribute[scope.id].position.offsetLeft = ui.offset.left;
                scope.$apply();
              }
            });
            elem.resizable({
              resize: function (evt, ui) {
                scope.myAttribute[scope.id].size = scope.myAttribute[scope.id].size || {};
                scope.myAttribute[scope.id].size = ui.size;
                scope.$apply();
                //if (scope.callback) { scope.callback(); }
              },
              stop: function (evt, ui) {
                  if (scope.callback) { scope.callback(); }
              }
            });
        }
    };
});


app.controller('MenuDockCtrl', function ($scope) {
    $scope.docked = true;
    $scope.toggleCustom = function() {
        $scope.docked = !$scope.docked;
        if(!$scope.docked) {
          angular.element("#2").draggable("disable",true);
          angular.element("#2").resizable("disable",true);
          angular.element("#2").css({top: 0, left: 0, position:'absolute', 'width':'100%', 'height':'55px'});
          return;
        }
        angular.element("#2").draggable("enable");
        angular.element("#2").resizable("enable");
    }
});