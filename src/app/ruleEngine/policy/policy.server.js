(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('policyServer', policyServer)

  /////////

  /* @ngInject */
  function policyServer($httpApi, $config, $dialogs) {

    return {
        strategyList: function(item) {
          return $httpApi.post($config.apiPolicy.strategyList, item);
        },
        strategyEditDict: function(item) {
          return $httpApi.post($config.apiPolicy.strategyEditDict, item);
        },
        strategyAdd: function(item) {
          return $httpApi.post($config.apiPolicy.strategyAdd, item);
        },
        strategyDelete: function(item) {
          return $httpApi.post($config.apiPolicy.strategyDelete, item);
        },
        strategyEditLevel: function(item) {
          return $httpApi.post($config.apiPolicy.strategyEditLevel, item);
        },
        strategySearch:function(item){
          return $httpApi.post($config.apiPolicy.strategySearch, item);
        },
        addPolicy:function(item) {  //增加列表
            return $dialogs.create('/app/ruleEngine/policy/addPolicy.dialog.html', 'addPolicyCtrl', item);
        },
        delPolicy:function(item) {  //删除列表
            return $dialogs.create('/app/ruleEngine/policy/delPolicy.dialog.html', 'delPolicyCtrl', item);
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
