(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('pictureModuleManagerCtrl', pictureModuleManagerCtrl)
    .controller('deleteAreaDialogCtrl', deleteAreaDialogCtrl)
    .controller('addProcessDialogCtrl', addProcessDialogCtrl)
    .controller('pictureEditCtrl', pictureEditCtrl)


  ;
  /* @ngInject */
  function pictureModuleManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, modulemanageServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.pageLoading = true;
    $scope.page={
        pageIndex:1,    //当前页索引。
        pageSize:20,    //单页记录条数
        totalCnt:20    //总记录数，这个是关键。必传
    }
    /**
     * 分页索引改变事件。业务开发通过此回调重新加载数据。
     */
    $scope.onPageIndexChanged=function(){
      // console.log($scope.page)
        getAddressList();
    };

    function getModuleList() {
      var params = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize
      }
      modulemanageServer.moduleList(params).then(function(res){
        $scope.moduleList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
        $scope.pageLoading = false;
      })
    }
    getModuleList();

    $scope.addProcess = function(id){
      modulemanageServer.addProcessDialog().result.then(function(data){
        if(data){
          getModuleList();
        }
      })
    }

    $scope.deleteArea = function(id){
      modulemanageServer.deleteAreaDialog({id:id}).result.then(function(data){
        if(data){
          getModuleList();
        }
      })
    }

    
  }
  function deleteAreaDialogCtrl($rootScope,$scope, $timeout, $state, $sce,modulemanageServer,$stateParams,$toaster,$httpApi,$config,data,$modalInstance) {
    $scope.cancel = function() {
        $modalInstance.dismiss('Canceled');
    };

    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          modulemanageServer.deleteForm({id:data.id}).then(function(res){
            $scope.saveloading = false;
            $modalInstance.close(true);
          });
        });
      }
    }
  }
  function addProcessDialogCtrl($rootScope,$scope, $timeout, $state, $sce,modulemanageServer,$stateParams,$toaster,$httpApi,$config,data,$modalInstance) {
    $scope.cancel = function() {
        $modalInstance.dismiss('Canceled');
    };

    $scope.entity = {};

    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          modulemanageServer.addProcess($scope.entity).then(function(res){
            $scope.saveloading = false;
            $modalInstance.close(true);
          });
        });
      }
    }
  }
  function pictureEditCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, modulemanageServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })

    $scope.entity = {};
    
    $scope.pageLoading = true;
    function getFormDetail() {
      modulemanageServer.getFormDetail({Id:$stateParams.id}).then(function(res){
        $scope.detailData = res.res.data;
        if($scope.detailData.length){
          $scope.entity = res.res.data[0];
        }
        $scope.pageLoading = false;
      })
    }
    getFormDetail();

    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          modulemanageServer.addProcessForm($scope.entity).then(function(res){
            $scope.saveloading = false;
            // $modalInstance.close(true);
          });
        });
      }
    }

    
  }

})();
