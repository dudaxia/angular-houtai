(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('roleServer', roleServer)

  /////////

  /* @ngInject */
  function roleServer($httpApi, $config, $dialogs) {

    return {
        roleList: function(item) {
          return $httpApi.post($config.role.roleList, item);
        },
        roleDict: function(item) {
          return $httpApi.post($config.role.roleDict, item);
        },
        delRole: function(item) {
          return $httpApi.post($config.role.delRole, item);
        },
        roleInfo: function(item) {
          return $httpApi.post($config.role.roleInfo, item);
        },
        sureAddRole: function(item) {
          return $httpApi.post($config.role.addRole, item);
        },
        editRole: function(item) {
          return $httpApi.post($config.role.editRole, item);
        },
        addRole:function(item) {  //增加列表
            return $dialogs.create('/app/managecenter/role/addRole.dialog.html', 'addRoleCtrl', item, {size: 'lg'});
        },
        delRoleListItem:function(item) {  //删除列表
            return $dialogs.create('/app/managecenter/role/delRole.dialog.html', 'delRoleCtrl', item);
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
