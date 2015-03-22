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