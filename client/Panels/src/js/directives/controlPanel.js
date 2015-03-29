app.directive('controlPanel', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      scope.Config[attrs.id] = {};
      delete $.ui.resizable.prototype.options.zIndex;
      elem.addClass("panel panel-default");
        elem.draggable({
          containment: 'window', 
          drag: function(evt,ui) {
            scope.Config[attrs.id].position = ui.position;
            scope.$apply();
          }
        });
      
        elem.resizable({
          resize: function (evt, ui) {
            scope.Config[attrs.id].size = ui.size;
            scope.$apply();
          },
          stop: function (evt, ui) {
              if (scope.callback) { scope.callback(); }
          }
        });
      
    }
  };
});