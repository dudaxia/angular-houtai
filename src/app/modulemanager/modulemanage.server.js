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
          }
      }
    }])
})();
