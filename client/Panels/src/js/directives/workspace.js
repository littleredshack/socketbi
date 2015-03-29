app.directive('workspace', function ($compile) {
  return {
    restrict: 'E',
    template: '<div id="workspace"></div>',
    replace: true,
    link: function (scope, elem, attrs) {
      elem.draggable({
        drag: function(evt,ui) {
        }
      });
      var childPanels = [];
      elem.resizable({
        start: function (evt, ui){
            childPanels = [];
            angular.forEach(angular.element('#workspace').children('.panel'), function(value) {
              var id = value.id;
              var originalHeight = angular.element("#"+id)[0].offsetHeight ;
              var originalWidth = angular.element("#"+id)[0].offsetWidth ;
              var originalTop = angular.element("#"+id)[0].offsetTop ;
              var originalLeft = angular.element("#"+id)[0].offsetLeft ;
              var obj = {'id':id,'originalHeight':originalHeight, 'originalWidth':originalWidth, 'originalTop':originalTop, 'originalLeft':originalLeft};
              childPanels.push(obj);
            });
          }
        },
        resize: function (evt, ui) {
            var resizeRatioHeight = ui.size.height/ui.originalSize.height;
            var resizeRatioWidth = ui.size.width/ui.originalSize.width;
            
            angular.forEach(childPanels, function(value) {
              scope.$apply();
            });
          }
        },
        stop: function (evt, ui) {
            if (scope.callback) { scope.callback(); }
        }
      });
    }
  };
});
