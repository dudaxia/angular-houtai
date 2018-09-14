(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('processServer', ['$httpApi', '$config', '$dialogs', '$tableids', function($httpApi, $config, $dialogs, $tableids) {
      return {
          processList: function(item) {
            return $httpApi.get($config.api3.process.processList, item);
          },
          addProcessDialog: function(item) {
            return $dialogs.create('/app/process/addProcess.dialog.html', 'addProcessDialogCtrl',item);
          },
          addProcess: function(item) {
            return $httpApi.post($config.api3.process.addProcess, item);
          },
          editProcess: function(item) {
            return $httpApi.post($config.api3.process.editProcess, item);
          },
          addSetProcessDialog: function(item) {
            return $dialogs.create('/app/process/addSetProcess.dialog.html', 'addSetProcessCtrl',item);
          },
      }
    }])
})();
