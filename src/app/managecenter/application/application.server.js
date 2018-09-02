(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('applicationServer', applicationServer)

  /////////

  /* @ngInject */
  function applicationServer($httpApi, $config, $dialogs) {

    return {
      applicationList: function(item) {
        return $httpApi.post($config.apiApplication.applicationList, item);
      },
      applicationAdd: function(item) {
        return $httpApi.post($config.apiApplication.applicationAdd, item);
      },
      applicationEdit: function(item) {
        return $httpApi.post($config.apiApplication.applicationEdit, item);
      },
      applicationDelete:function(item){
        return $httpApi.post($config.apiApplication.applicationDelete, item);
      },
      addApplication:function(item) {  //增加列表
        return $dialogs.create('/app/managecenter/application/addApplication.dialog.html', 'addApplicationCtrl', item);
      },
      editApplication:function(item) {  //增加列表
        return $dialogs.create('/app/managecenter/application/addApplication.dialog.html', 'editApplicationCtrl', item);
      },
      delApplication:function(item) {  //删除列表
        return $dialogs.create('/app/managecenter/application/delApplication.dialog.html', 'delApplicationCtrl', item);
      }
    }
  }
})();
