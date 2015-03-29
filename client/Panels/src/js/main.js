var app = angular.module('LRS.socketbi.client', ['ui.bootstrap','xeditable']);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-xs';
  editableThemes.bs3.buttonsClass = 'btn-xs';
  editableOptions.theme = 'bs3';
});


app.filter('percentage', ['$filter', function ($filter) {
  return function (input) {
    return $filter('number')(input) + '%';
  };
}]);