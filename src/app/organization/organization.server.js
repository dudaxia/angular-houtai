(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('organizationServer', organizationServer)

  /////////

  /* @ngInject */
  function organizationServer($httpApi, $config, $dialogs) {
    var api = $config.apiList;

    return {
      sheetEditDict: resolve(api.sheetEditDict),
      getCompanyList: resolveGet($config.api3.organization.list),

      deleteList:function(item){ //删除列表一数据
        return $dialogs.create('/app/organization/company/deleteList.dialog.html', 'deleteOrganizationListCtrl', item);
      },
    };
    function resolve(url) {
      return function (item) {
        return $httpApi.post(url, item, {}, 'apiUrlPrefixStore');
      }
    }
    function resolveGet(url) {
      return function (item) {
        return $httpApi.get(url, item, {}, 'apiUrlPrefixStore');
      }
    }
  }
})();
