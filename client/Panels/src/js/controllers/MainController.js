app.controller('MainController', function ($http, $scope) {

  $scope.someFunction = function () {
      //console.log('Resized !');
  };

  $scope.currentWorkspaceIndex = 0;

  $scope.nextIndex = function(){
    return $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels.length;
  };

  $scope.setCurrentPanelValue = function (variable, value){
  	$scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex][variable] = value;
  	// $scope.apply();
  };

  $scope.Config = {
  	Workspaces: [
  		{
  			name: 'Workspace 1',
  			Panels : [
  			]
  		}
  	]
  };

  $scope.style={};

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
    // TODO: Get position of current Panel and update value in Config
    // $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex].position.top = angular.element('#'+$scope.currentPanelID)[0].offsetTop;
    // $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex].position.left = angular.element('#'+$scope.currentPanelID)[0].offsetLeft;

    //console.log(angular.element('#'+$scope.currentPanelID)[0].offsetTop);
    return $scope.style;
  };

});



