app.controller('MainController', function ($http, $scope) {

  $scope.currentWorkspaceIndex = 0;
  $scope.style={};

  $scope.Config = {
    Workspaces: [
      {
        name: 'Workspace 1',
        Panels : [
        ]
      }
    ]
  };

  $scope.nextIndex = function(){
    return $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels.length;
  };

/*
Reads the style object for a specified panel
Returns a style object used by default Panels in their ng-style
*/
  $scope.applyStyle = function(panelindex) {
    var thisPanel = {};

    if (typeof $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[panelindex] === 'undefined') 
      return
    else thisPanel = $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[panelindex];

    return thisPanel.style ;
  }

/*
Meant to be used for advanced config in configurator
Will probably disable that functionality
*/
  $scope.newStyle = function(ns) {
    try {
      var obj=JSON.parse(ns);
    } catch(e) {
      alert("Invalid syntax in style"); 
      return;
    }

    if(typeof $scope.currentPanelIndex === 'undefined') { alert("Select a target panel"); return; }
    
    $scope.style = obj;
    $scope.setCurrentPanelValue('style',$scope.style);
    return $scope.style;
  };

  $scope.getShowPanelHeadingSetting = function() {
    //console.log($scope.Config.Workspaces[currentWorkspaceIndex].Panels[currentPanelIndex].hidepanelheading);
    if ( typeof $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex] === 'undefined') return;
    return $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex].showpanelheading;
  }


});



