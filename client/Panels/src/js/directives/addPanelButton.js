app.directive('addPanelButton', function ($http, $compile, $templateCache) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('click', function () {
        /*
        var htmlText = '<newpanel></newpanel>';
        var e = angular.element(htmlText);
        $compile(e)(scope);
        angular.element('#workspace').append(e);
        */
        $http.get('views/panel.html', {cache: $templateCache}).success(function(tplContent){
          var newIndex = scope.nextIndex();
          tplContent = tplContent.replace(/NEXTINDEX/g,newIndex);
          angular.element('#workspace').append($compile(tplContent)(scope));  
        });
    });
  }
}
});
