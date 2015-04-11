app.directive('addPanelButton', function ($http, $compile, $templateCache) {

  function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return [].map.call(arr, function(n) { return n.toString(16); }).join("");
  }

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

          //var newIndex = scope.nextIndex();
          var newIndex = generateId(10);
          tplContent = tplContent.replace(/NEXTINDEX/g,newIndex);
          angular.element('#workspace').append($compile(tplContent)(scope));  
        });
    });
  }
}
});
