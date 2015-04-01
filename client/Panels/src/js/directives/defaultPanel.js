app.directive('defaultPanel', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var p = scope.nextIndex();
      scope.Config.Workspaces[0].Panels[p] = {};
      
      scope.Config.Workspaces[0].Panels[p].id = attrs.id;
      scope.Config.Workspaces[0].Panels[p].style = {};
      scope.Config.Workspaces[0].Panels[p].panelTitle = 'Panel Title';
      scope.Config.Workspaces[0].Panels[p].showpanelheading = true;

      // quirky thing with jQuery resize-handles
      // http://stackoverflow.com/questions/4673398/jquery-resizable-handle-z-index
      delete $.ui.resizable.prototype.options.zIndex;

      if (attrs.canDrag === 'true') {
        elem.draggable({
          stack: '.panel-in-workspace',
          containment: 'parent', 
          drag: function(evt,ui) {
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style = scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style || {};
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.top = ui.position.top;
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.left = ui.position.left;
            scope.$apply();
          }
        });
      }
    
      if (attrs.canResize === 'true') {
        elem.resizable({
          autoHide: true,
          containment: 'parent',
          resize: function (evt, ui) {
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style = scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style || {};
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.height = ui.size.height;
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.width = ui.size.width;
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