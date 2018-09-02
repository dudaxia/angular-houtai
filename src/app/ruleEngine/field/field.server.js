(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('fieldServer', fieldServer)

  /////////

  /* @ngInject */
  function fieldServer($httpApi, $config, $dialogs) {
    var api = $config.apiField;

    return {
      //字段管理
      fieldListDict: resolve(api.fieldListDict)
    };

    /////////

    function resolve(url) {
      return function (item) {
        return $httpApi.post(url, item, {}, 'apiUrlPrefixStore');
      }
    }
  }
})();
