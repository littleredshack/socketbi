app.controller('MainController', function ($http, $scope) {
  $scope.panelConfigs = [];
  $scope.someFunction = function () {
      //console.log('Resized !');
  };
  $scope.pIndex = 4;
  $scope.nextIndex = function(){
    return $scope.pIndex++;
  };
});
