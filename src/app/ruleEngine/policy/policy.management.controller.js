(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('policyManagementCtrl', policyManagementCtrl)
    .controller('addPolicyCtrl', addPolicyCtrl)
    .controller('delPolicyCtrl', delPolicyCtrl)
  ;

  /* @ngInject */
  function policyManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, policyServer, $timeout, $toaster,listServer) {
    /*事件类型查询*/
    $scope.searchParams = {code: ''};
    // policyServer.strategyList().then(function (ret) {
    //   if (ret && ret.data) $scope.policyList = ret.data.pageBean.recordList || [];
    //   console.log($scope.policyList)
    // },function () {
    // });

    $scope.$on('reload', function () {
      $state.reload();
    })
    var tableHelpExp = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    });

    $scope.tableParams = tableHelpExp.tableParams($config.apiPolicy.strategyList, function() {
      var params = {
        params:{applicationCode:$rootScope.applicationCode}
      };
      if ($scope.searchParams.code){
        params.params.eventCode = $scope.searchParams.code
      }
      return params;
    });

    // 获取事件类型
    policyServer.strategySearch({}).then(function (res) {
      // console.info(res.data)
      if (res && res.data) $scope.eventList = res.data.event;
    });
    $scope.onSearch = function(){
      $scope.tableParams.page(1);
      $scope.tableParams.reload();
    }
    /*新增事件*/
    $scope.addPolicy = function(){
      policyServer.addPolicy().result.then(function(ret){
          if(ret==true){
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
          }
      })
    }
    $scope.deletePolicy = function(id){
      policyServer.delPolicy({id:id}).result.then(function(ret){
          if(ret==true){
            // $scope.tableParams.page(1);
            // $scope.tableParams.reload();
          }
      })
      // policyServer.strategyDelete({id:id}).then(function(ret){
      //     $toaster.success(ret.msg);
      //     $state.reload();
      // }, function() {
      //     $toaster.info(ret.msg);
      // }).finally(function() {
      // })
    }
  }
  /* @ngInject */
  function addPolicyCtrl($scope, $state, $stateParams, $config, tableHelp, listServer, policyServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.vm = {
      patternCode:2
    }
    // console.log(data);
    if (data && data.applicationCode!=undefined) $scope.vm.applicationCode = data.applicationCode;
    if (data && data.desc!=undefined) $scope.vm.desc = data.desc;
    if (data && data.name!=undefined) $scope.vm.name = data.name;
    if (data && data.typeCode!=undefined) $scope.vm.typeCode = data.typeCode;
    if (data && data.sheetName!=undefined) $scope.vm.name = data.sheetName;

    policyServer.strategyEditDict().then(function (res) {
      // console.log(res.data)
      if (res && res.data) $scope.applicationList = res.data.application;
      if (res && res.data) $scope.eventList = res.data.event;
      if (res && res.data) $scope.patternList = res.data.pattern;
      if (res && res.data) $scope.riskTypeList = res.data.riskType;
      // if (res && res.data) $scope.appList = res.data.application;
      // if (res && res.data) $scope.sheetList = res.data.sheetType;
    });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.maxLevel = [];
    for (var i = 0; i <= 2; i++) {
      $scope.maxLevel.push({id:i});
    }
    $scope.riskLevel = function(eventCode,patternCode){
      var params = {}
      params.eventCode = eventCode;
      params.patternCode = patternCode;
      if(params.eventCode!=undefined&&params.patternCode!=undefined){
        policyServer.strategyEditLevel(params).then(function(ret){
          if (ret.data && ret.data.maxLevel) {
            $scope.vm.maxLevel = ret.data.maxLevel;
            $scope.maxLevel = [];
            for (var i = 0; i <= $scope.vm.maxLevel; i++) {
              $scope.maxLevel.push({id:i});
            }
          }
          if (ret.data && ret.data.thresholds){
            $scope.vm.thresholds = ret.data.thresholds;
          }else{
            $scope.vm.thresholds = [];
          }
        }, function() {
        }).finally(function() {
        })
      }
    }
    $scope.changeThresholds=function(item,index){
      $scope.vm.thresholds[index] = parseInt(item);
    }
    $scope.policyEdit = {
      submitHandler: function () {
        var params = {};
        if ($scope.vm && $scope.vm.applicationCode!=undefined) params.applicationCode = $scope.vm.applicationCode;
        if ($scope.vm && $scope.vm.eventCode!=undefined) params.eventCode = $scope.vm.eventCode;
        if ($scope.vm && $scope.vm.desc!=undefined) params.desc = $scope.vm.desc;
        if ($scope.vm && $scope.vm.name!=undefined) params.name = $scope.vm.name;
        if ($scope.vm && $scope.vm.riskTypeCode!=undefined) params.riskTypeCode = $scope.vm.riskTypeCode;
        if ($scope.vm && $scope.vm.patternCode!=undefined) params.patternCode = $scope.vm.patternCode;
        if ($scope.vm && $scope.vm.thresholds!=undefined) params.riskThresholdList = $scope.vm.thresholds;
        if ($scope.vm && $scope.vm.identificationCode!=undefined) params.identificationCode = $scope.vm.identificationCode;
        console.info(params)
        policyServer.strategyAdd(params).then(function(ret){
            $toaster.success(ret.msg);
            $modalInstance.close(true);
        }, function(ret) {
            $toaster.info(ret.msg);
        }).finally(function() {
            $scope.saveloading = false;
        })
      }
    }
  }
  /* @ngInject */
  function delPolicyCtrl($scope, $state, $stateParams, $config, tableHelp, listServer, policyServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = {}
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        policyServer.strategyDelete(params).then(function(ret){
          $toaster.success(ret.msg);
          $state.reload();
          $modalInstance.close();
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }

})();
