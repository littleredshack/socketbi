app.directive('defaultPanel', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      //var len = scope.Config.Workspaces[0].Panels.length;
      //scope.Config.Workspaces[0].Panels[len] = {} ;
      var p = scope.nextIndex();
      scope.Config.Workspaces[0].Panels[p] = {};
      
      scope.Config.Workspaces[0].Panels[p].id = attrs.id;
      scope.Config.Workspaces[0].Panels[p].style = {};
      
      // quirky thing with jQuery resize-handles
      // http://stackoverflow.com/questions/4673398/jquery-resizable-handle-z-index
      delete $.ui.resizable.prototype.options.zIndex;
      elem.addClass("panel panel-default");
/*
      scope.$watch('Config.Workspaces[currentWorkspaceIndex].Panels[p].style.top', function (newValue, oldValue) {
        if (newValue) {
          console.log("top has changed");
          scope.Config.Workspaces[0].Panels[0].position.top = newValue.top;
          scope.apply();
        }
      });
*/
      if (attrs.canDrag === 'true') {
        elem.draggable({
          stack: '.panel-in-workspace',
          containment: 'parent', 
          drag: function(evt,ui) {
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style = scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style || {};
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.top = ui.position.top;
            scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].style.left = ui.position.left;
            //scope.Config.Workspaces[scope.currentWorkspaceIndex].Panels[scope.currentPanelIndex].offset = ui.offset;
            scope.$apply();
          }
        });
      }
    
      if (attrs.canResize === 'true') {
        elem.resizable({
          autoHide: true,
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