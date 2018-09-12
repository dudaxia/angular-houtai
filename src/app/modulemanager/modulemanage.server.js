(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('modulemanageServer', ['$httpApi', '$config', '$dialogs', '$tableids', function($httpApi, $config, $dialogs, $tableids) {
      return {
          // merchantDetail: function(item) {
          //   return $httpApi.post($config.api3.package.merchantDetail, item);
          // },
          addCityDialog: function(item) {
            return $dialogs.create('/app/modulemanager/city/addCity.dialog.html', 'addCityDialogCtrl',item);
          },
          citylist: function(item) {
            return $httpApi.get($config.api3.module.cityList, item);
          },
          addArea: function(item) {
            return $httpApi.post($config.api3.module.addArea, item);
          },
          moduleList: function(item) {
            return $httpApi.get($config.api3.module.moduleList, item);
          },
          deleteAreaDialog: function(item) {
            return $dialogs.create('/app/modulemanager/picture/deleteArea.dialog.html', 'deleteAreaDialogCtrl',item);
          },
          deleteArea: function(item) {
            return $httpApi.post($config.api3.module.deleteArea, item);
          }, 
          addProcessDialog: function(item) {
            return $dialogs.create('/app/modulemanager/picture/addProcess.dialog.html', 'addProcessDialogCtrl',item);
          },
          addProcess: function(item) {
            return $httpApi.post($config.api3.module.addProcess, item);
          },
          addProcessForm: function(item) {
            return $httpApi.post($config.api3.module.addProcessForm, item);
          },
          getFormDetail: function(item) {
            return $httpApi.get($config.api3.module.formDetail, item);
          },
          deleteForm: function(item) {
            return $httpApi.post($config.api3.module.deleteForm, item);
          },
      }
    }])
})();
