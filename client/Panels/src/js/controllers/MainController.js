app.controller('MainController', function ($http, $scope, socketbi, $rootScope, sessionProperties) {

  // Array Remove - By John Resig (MIT Licensed)
  // http://ejohn.org/blog/javascript-array-remove/
  var removeArrayItem = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
  };
  
  $scope.currentWorkspaceIndex = 0;
  
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
  $scope.applyStyle = function(panelID) {
    var thisPanel = {};

    var panelindex = $scope.Config.Workspaces[0].Panels.map(function(e) { return e.id; }).indexOf(panelID);    

    if (typeof $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[panelindex] === 'undefined') 
      return
    else thisPanel = $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[panelindex];

    if (panelindex === $scope.currentPanelIndex && $scope.showConfig)
      thisPanel.style.borderColor = 'yellow';
    else thisPanel.style.borderColor = '';

    return thisPanel.style ;
  }

/*
Meant to be used for advanced config in configurator
Will probably disable that functionality

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
*/

  $scope.deleteCurrentPanel = function () {
    var pId = $scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels[$scope.currentPanelIndex].id;
    angular.element("#"+pId).remove();
    removeArrayItem($scope.Config.Workspaces[$scope.currentWorkspaceIndex].Panels, $scope.currentPanelIndex);
    $scope.currentPanelID = null;
    $scope.currentPanelIndex = null;
  }

  $scope.getPanelTitle = function(panelID) {
    var panelindex = $scope.Config.Workspaces[0].Panels.map(function(e) { return e.id; }).indexOf(panelID);    
    if (typeof panelindex === 'undefined' || panelindex < 0) return;
    return $scope.Config.Workspaces[0].Panels[panelindex].panelTitle;
  }

  $scope.getPanelShowHeading = function(panelID) {
    var panelindex = $scope.Config.Workspaces[0].Panels.map(function(e) { return e.id; }).indexOf(panelID);          
    if (typeof panelindex === 'undefined' || panelindex < 0) return;
    return $scope.Config.Workspaces[0].Panels[panelindex].showpanelheading;
  }

  socketbi.on('connect', function () {
    $scope.socketConnected = true;
  });

  socketbi.on('auth', function (data) {
    if (data == 'failed') {
      alert('Login failed');
      return;
    }
    sessionProperties.set('sessionKey',data);
    $scope.getDataSources();
  });

  socketbi.on('dblist', function (data) {
    $scope.dblist = data;
  });

  socketbi.on('dataresponse', function (data) {
    console.log(data);
  });

  $scope.getDataSources = function(){
    var sk = sessionProperties.get().sessionKey;
    if (typeof sk === 'undefined') return;
    socketbi.emit('dblist', {'key':sk});
  }

}); // End Main Controller



