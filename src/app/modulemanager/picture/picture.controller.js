(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('pictureModuleManagerCtrl', pictureModuleManagerCtrl)
    .controller('deleteAreaDialogCtrl', deleteAreaDialogCtrl)
    .controller('addProcessDialogCtrl', addProcessDialogCtrl)
    .controller('pictureEditCtrl', pictureEditCtrl)
    .directive('customForm', ['$document', '$window',"$timeout","$toaster","$rootScope", function($document, $window,$timeout,$toaster,$rootScope) {
      return {
        restrict: 'AC',
        scope: {
          formInfo:'=?'
        },
        templateUrl: '/app/modulemanager/picture/customForm.tmp.html',
        link: function(scope, el, attr) {
            var formInfo = scope.formInfo;
          scope.deleteForm = function(info){
            $rootScope.$broadcast("deleteCustomForm",info)
          }
        }
      };
    }])

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
  function pictureEditCtrl($rootScope, $scope, $state, $stateParams, $config, tableHelp, modulemanageServer, $timeout, $toaster, $dialogs) {
    $scope.$on('reload', function () {
      $state.reload();
    })

    $scope.entity = {IsRequired:1};

    $scope.formTypeList = [
      {name:'单行输入',value:'TextBox'},
      {name:'多行输入',value:'TextArea'},
      {name:'数字输入',value:'NumberBox'},
      {name:'时间选择',value:'TimeBox'},
      {name:'下拉单选',value:'ListBox'},
      {name:'图片上传',value:'ImageBox'},
    ]

    $scope.pageLoading = true;
    function getFormDetail() {
      modulemanageServer.getFormDetail({Id:$stateParams.id}).then(function(res){
        $scope.addedFormList = res.res.data;
        $scope.pageLoading = false;
      })
    }
    getFormDetail();

    $rootScope.$on("deleteCustomForm",function(e,params){
      deleteCustomForm(params.id);
    })

    function deleteCustomForm(id){
      $dialogs.confirm('是否删除该表单?').result.then(function() {
        modulemanageServer.deleteForm({id:id}).then(function(res){
          getFormDetail();
          $scope.entity = {IsRequired:1};
          $scope.saveloading = false;
          $toaster.success("添加成功");
        });
      })
    }

    $scope.addForm = function() {
      $scope.entity.CategoryId = $stateParams.id;
      modulemanageServer.addProcessForm($scope.entity).then(function(res){
        getFormDetail();
        $scope.entity = {IsRequired:1};
        $scope.saveloading = false;
        $toaster.success("添加成功");
      });
    }
  
  }

})();
