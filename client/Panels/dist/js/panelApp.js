var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('MyController', function ($http, $scope) {
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
            callback: '&onResizeStop',
            canResize: '@',
            canDrag: '@'
        },
        link: function (scope, elem, attrs) {
            scope.myAttribute[scope.id] = scope.myAttribute[scope.id] || {};
            scope.myAttribute[scope.id].id = scope.id;
            // quirky thing with jQuery resize-handles
            // http://stackoverflow.com/questions/4673398/jquery-resizable-handle-z-index
            delete $.ui.resizable.prototype.options.zIndex;
            elem.addClass("panel panel-default");
            if (scope.canDrag === 'true') {
              elem.draggable({
                stack: '.panel',
                containment: 'window', 
                drag: function(evt,ui) {
                  scope.myAttribute[scope.id].position = scope.myAttribute[scope.id].position || {};
                  scope.myAttribute[scope.id].position.offsetTop = ui.offset.top;
                  scope.myAttribute[scope.id].position.offsetLeft = ui.offset.left;
                  scope.$apply();
                }
              });
            }
            if (scope.canResize === 'true') {
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
        }
    };
});
