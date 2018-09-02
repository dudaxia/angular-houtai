(function () {
  'use strict';
  angular
    .module('ngTicket')
    .factory('tacticsServer', tacticsServer)
  function tacticsServer($httpApi, $config, $dialogs) {
    var api = $config.apiPolicy;

    return {
      strategyModify: function(item) {
        return $httpApi.post($config.apiPolicy.strategyModify, item);
      },
      ruleList: function(item) {
        return $httpApi.post($config.apiPolicy.ruleList, item);
      },
      ruleDisable: function(item) {
        return $httpApi.post($config.apiPolicy.ruleDisable, item);
      },
      ruleEnable: function(item) {
        return $httpApi.post($config.apiPolicy.ruleEnable, item);
      },
      ruleDelete: function(item) {
        return $httpApi.post($config.apiPolicy.ruleDelete, item);
      },
      templateList: function(item) {
        return $httpApi.post($config.apiPolicy.templateList, item);
      },
      ruleDict: function(item) {
        return $httpApi.post($config.apiPolicy.ruleDict, item);
      },
      ruleAdd: function(item) {
        return $httpApi.post($config.apiPolicy.ruleAdd, item);
      },
      ruleModify: function(item) {
        return $httpApi.post($config.apiPolicy.ruleModify, item);
      },
      calc: function(item) {
        return $httpApi.post($config.apiPolicy.calc, item);
      },
      findById: function(item) {
        return $httpApi.post($config.apiPolicy.findById, item);
      },
      tacticSort:function(item){  //规则排序
        return $httpApi.post($config.apiPolicy.tacticSort, item);
      },
      addList:function(item) {//模板弹框
          return $dialogs.create('/app/ruleEngine/tactics/addTemplet.html', 'addTempletCtrl', item);
      },
      addList2:function(item) {//模板弹框
          return $dialogs.create('/app/ruleEngine/tactics/addTemplet2.html', 'addTempletCtrl', item);
      },
      add_templet:function(item) {  //增加模板
          return $dialogs.create('/app/ruleEngine/tactics/add_templet.html', 'add_templetCtrl', item);
      },
      delTactics:function(item) {  //删除规则
          return $dialogs.create('/app/ruleEngine/tactics/delTactics.dialog.html', 'delTacticsCtrl', item);
      }
    };

    function resolve(url) {
      return function (item) {
        return $httpApi.post(url, item, {}, 'apiUrlPrefixStore');
      }
    };

  }
})();
