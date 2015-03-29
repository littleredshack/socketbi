app.controller('StyleController', function($scope) {
    $scope.master = {content:"{top:0px;}}"};
    $scope.reset = function() {
        $scope.style = angular.copy($scope.master);
    };
    //$scope.reset();

});