(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('listServer', listServer)

  /////////

  /* @ngInject */
  function listServer($httpApi, $config, $dialogs) {
    var api = $config.apiList;

    return {
        sheetEditDict: resolve(api.sheetEditDict),
        sheetAdd: resolve(api.sheetAdd),
        sheetDelete:resolve(api.sheetDelete),
        sheetdataListDict: resolve(api.sheetdataListDict),
        sheetdataImport: resolve(api.sheetdataImport),
        sheetdataAdd: resolve(api.sheetdataAdd),
        sheetdataDelete:resolve(api.sheetdataDelete),
        sheetdataModify: resolve(api.sheetdataModify),
        sheetModify: resolve(api.sheetModify),
        addList:function(item) {  //增加列表
            return $dialogs.create('/app/ruleEngine/list/addList.dialog.html', 'addListCtrl', item);
        },
        addData:function(item) {  //增加列表
            return $dialogs.create('/app/ruleEngine/list/addData.dialog.html', 'addDataCtrl', item);
        },
        import:function(item) {  //增加列表
            return $dialogs.create('/app/ruleEngine/list/import.dialog.html', 'importCtrl', item);
        },
        deleteList:function(item){ //删除列表一数据
          return $dialogs.create('/app/ruleEngine/list/deleteList.dialog.html', 'deleteListCtrl', item);
        },
        deleteData:function(item){ //删除列表二数据
          return $dialogs.create('/app/ruleEngine/list/deleteData.dialog.html', 'deleteDataCtrl', item);
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
