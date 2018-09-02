(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('fieldManagementCtrl', fieldManagementCtrl)
  ;

  /* @ngInject */
  function fieldManagementCtrl($scope, $state, $stateParams, $config, tableHelp, fieldServer, $timeout, $toaster) {
    $scope.searchParams = {code: ''};
    // 获取事件类型
    fieldServer.fieldListDict({}).then(function (res) {
      if (res && res.data) $scope.eventList = res.data.event;
    });

    var tableHelpExp = tableHelp($scope, {
      pageSize: 50,
      proxy: 'apiUrlPrefixStore'
    });

    $scope.tableParams = tableHelpExp.tableParams($config.apiField.fieldList, function() {
      var params = {
        params:{}
      };
      if ($scope.searchParams.code) params.params.eventCode = $scope.searchParams.code;
      return params;
    });
    $scope.tableParams.count(50) // 防止分页bar公用pageSize

    $scope.onSearch = function () {
      $scope.tableParams.page(1);
      $scope.tableParams.reload();
    };
}
})();
