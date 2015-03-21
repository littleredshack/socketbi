app.directive('workspace', function ($compile) {
  return {
    restrict: 'E',
    template: '<div id="workspace"></div>',
    replace: true,
    link: function (scope, elem, attrs) {
      elem.draggable({
        //containment: 'body', 
        drag: function(evt,ui) {
          // scope.panelConfigs[scope.id].offset = ui.offset;
          // scope.apply();
        }
      });
      elem.resizable({
        resize: function (evt, ui) {
          // scope.panelConfigs[scope.id].size = scope.panelConfigs[scope.id].size || {};
          // scope.panelConfigs[scope.id].size = ui.size;
          //scope.$apply();
        },
        stop: function (evt, ui) {
            if (scope.callback) { scope.callback(); }
        }
      });
    }
  };
});
