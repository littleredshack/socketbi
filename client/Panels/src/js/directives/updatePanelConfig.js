app.directive('updatePanelConfig', function () {
  return {
    link: function (scope, elem, attrs ) {
      elem.bind("mousedown", function( evt ){
        scope.currentPanelID = attrs.id;
        var w = scope.currentWorkspaceIndex;
        var p =  scope.Config.Workspaces[w].Panels.map(function(e) { return e.id; }).indexOf(attrs.id);
        scope.currentPanelIndex = p;
        scope.Config.Workspaces[w].Panels[p].position = {top: evt.currentTarget.offsetTop, left: evt.currentTarget.offsetLeft}; 
        scope.$apply();
        })
    }
  }
});