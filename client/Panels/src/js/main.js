var app = angular.module('LRS.socketbi.client', ['ui.bootstrap','xeditable','colorpicker.module','btford.socket-io']);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-xs';
  editableThemes.bs3.buttonsClass = 'btn-xs';
  editableOptions.theme = 'bs3';
});

app.factory('socketbi', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('localhost:3080')
  });
})

