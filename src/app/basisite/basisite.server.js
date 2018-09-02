(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('basisiteServer', ['$httpApi', '$config', '$dialogs', '$tableids', function($httpApi, $config, $dialogs, $tableids) {
      return {
          // merchantDetail: function(item) {
          //   return $httpApi.post($config.api3.package.merchantDetail, item);
          // },
          delAddress: function(item) {
            return $dialogs.create('/app/basisite/delAddress.dialog.html', 'delAddressDialogCtrl',item);
          },
          basisitelist:function(item){
            return $httpApi.get($config.api3.basisite.list, item);
          }
      }
    }])
})();