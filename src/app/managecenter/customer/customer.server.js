(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('customerServer', customerServer)

  /////////

  /* @ngInject */
  function customerServer($httpApi, $config, $dialogs) {

    return {
      customerAdd: function(item) {
        return $httpApi.post($config.apiCustomer.customerAdd, item);
      },
      customerEdit: function(item) {
        return $httpApi.post($config.apiCustomer.customerEdit, item);
      },
      customerDelete:function(item){
        return $httpApi.post($config.apiCustomer.customerDelete, item);
      },
      bachCustomerAdd: function(item) {
        return $httpApi.post($config.apiCustomer.bachCustomerAdd, item);
      },
      bachCustomerDelete:function(item){
        return $httpApi.post($config.apiCustomer.bachCustomerDelete, item);
      },
      addCustomer:function(item) {  //新增
        return $dialogs.create('/app/managecenter/customer/addCustomer.dialog.html', 'addCustomerCtrl', item);
      },
      editCustomer:function(item) {  //编辑
        return $dialogs.create('/app/managecenter/customer/addCustomer.dialog.html', 'editCustomerCtrl', item);
      },
      delCustomer:function(item) {  //删除
        return $dialogs.create('/app/managecenter/customer/delCustomer.dialog.html', 'delCustomerCtrl', item);
      },
      addBachCustomer:function(item) {  //批量新增
        return $dialogs.create('/app/managecenter/customer/addBachCustomer.dialog.html', 'addBachCustomerCtrl', item);
      },
      delBachCustomer:function(item) {  //批量删除
        return $dialogs.create('/app/managecenter/customer/delBachCustomer.dialog.html', 'delBachCustomerCtr', item);
      }
    };

    /////////

    function resolve(url) {
      return function (item) {
        return $httpApi.post(url, item, {}, 'apiUrlPrefixStore');
      }
    }
  }
})();
