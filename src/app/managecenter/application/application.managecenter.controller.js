(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('applicationCtrl', applicationCtrl)
    .controller('addApplicationCtrl', addApplicationCtrl)
    .controller('delApplicationCtrl', delApplicationCtrl)
    .controller('editApplicationCtrl', editApplicationCtrl)
    .filter('showelepsis', ['$rootScope',function($rootScope) {
      return function(items) {
        if(items&&items.length<=20){
          return items;
        } else if(items&&items.length>20){
          return (items.substring(0,20)+"...");
        } else {
          return '';
        }
      };
    }])
  ;

  /* @ngInject */
  function applicationCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp,applicationServer, $timeout, $toaster,listServer) {

    $scope.$on('reload', function () {
      $state.reload();
    })
    /*查询初始化*/
    $scope.searchparams = {value:''}
    var tableHelpExp = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    });

    $scope.tableParams = tableHelpExp.tableParams($config.apiApplication.applicationList, function() {
      var params = {
        params:{code:$rootScope.applicationCode}
      };
      if($scope.searchparams.value) params.params.value = $scope.searchparams.value;
      return params;
    });
    $scope.tableParams.count(10)
    /*查询事件*/
    $scope.onSubmit = function(){
      $scope.tableParams.page(1);
      $scope.tableParams.reload();
    }
    /*新增事件*/
    $scope.addApplication = function(){
      applicationServer.addApplication().result.then(function(ret){
        if(ret==true){
          $scope.tableParams.page(1);
          $scope.tableParams.reload();
        }
      })
    }
    /*编辑事件*/
    $scope.editApplication = function(item){
      var params = {};
      if (item) params = item;
      applicationServer.editApplication(params).result.then(function(ret){
        if(ret==true){
          $scope.tableParams.page(1);
          $scope.tableParams.reload();
        }
      })
    }
    /*删除事件*/
    $scope.deleteApplication = function(item){
      var params = {};
      if (item) params = item;
      applicationServer.delApplication(params).result.then(function(ret){
        if(ret==true){
          // $scope.tableParams.page(1);
          // $scope.tableParams.reload();
        }
      })
    }





  }
  /* @ngInject */
  /*新增弹窗*/
  function addApplicationCtrl($scope,applicationServer,$toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = {}
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = angular.copy($scope.vm);
        applicationServer.applicationAdd(params).then(function(ret){
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
  /*编辑弹窗*/
  function editApplicationCtrl($scope,applicationServer,$toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = {}
    if(data && data.value!=undefined){
      $scope.vm.value = data.value
      $scope.vm.desc = data.desc
      $scope.vm.id = data.id
      $scope.editApplication =true;
    }
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = angular.copy($scope.vm);
        applicationServer.applicationEdit(params).then(function(ret){
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
  /*删除弹窗*/
  function delApplicationCtrl($scope,$state,applicationServer,$toaster, $modalInstance,data){
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm ={};
    $scope.vm.value = data.value
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        applicationServer.applicationDelete(params).then(function(ret){
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
