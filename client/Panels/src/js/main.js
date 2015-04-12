var app = angular.module('LRS.socketbi.client', ['ui.bootstrap','xeditable','colorpicker.module','angularModalService']);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-xs';
  editableThemes.bs3.buttonsClass = 'btn-xs';
  editableOptions.theme = 'bs3';
});
