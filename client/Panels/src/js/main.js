var app = angular.module('LRS.socketbi.client', ['ui.bootstrap']);

app.controller('MyController', function ($http, $scope) {
  $scope.panelConfigs = [];
  $scope.someFunction = function () {
      //console.log('Resized !');
  };
  $scope.pIndex = 4;
  $scope.nextIndex = function(){
    return $scope.pIndex++;
  };

});

app.directive('updatePanelConfig', function () {
  return {
    link: function (scope, elem, attrs ) {
      elem.bind("click", function( evt ){
        scope.currentPanelID = attrs.id;
        scope.panelConfigs[scope.currentPanelID].offset = {top: evt.currentTarget.offsetTop, left: evt.currentTarget.offsetLeft}; 
        scope.$apply();
        })
    }
  }
});


app.directive('defaultPanel', function () {
    return {
        restrict: 'A',
        scope: {
            id: '@',
            panelConfigs: '=',
            callback: '&onResizeStop',
            canResize: '@',
            canDrag: '@'
        },
        link: function (scope, elem, attrs) {
            scope.panelConfigs[scope.id] = scope.panelConfigs[scope.id] || {};
            scope.panelConfigs[scope.id].id = scope.id;
            // quirky thing with jQuery resize-handles
            // http://stackoverflow.com/questions/4673398/jquery-resizable-handle-z-index
            delete $.ui.resizable.prototype.options.zIndex;
            elem.addClass("panel panel-default");

            if (scope.canDrag === 'true') {
              elem.draggable({
                stack: '.panel-in-workspace',
                containment: '#workspace', 
                drag: function(evt,ui) {
                  scope.panelConfigs[scope.id].offset = ui.offset;
                  scope.$apply();
                }
              });
            }
            if (scope.canResize === 'true') {
              elem.resizable({
                resize: function (evt, ui) {
                  scope.panelConfigs[scope.id].size = scope.panelConfigs[scope.id].size || {};
                  scope.panelConfigs[scope.id].size = ui.size;
                  scope.$apply();
                },
                stop: function (evt, ui) {
                    if (scope.callback) { scope.callback(); }
                }
              });
            }
        }
    };
});
