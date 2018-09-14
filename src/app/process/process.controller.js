(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('processListCtrl', processListCtrl)
    .controller('addProcessDialogCtrl', addProcessDialogCtrl)
    .controller('setProcessListCtrl', setProcessListCtrl)
    .controller('addSetProcessCtrl', addSetProcessCtrl)
  ;
  /* @ngInject */
  function processListCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster, processServer) {
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
        getProcessList();
    };

    function getProcessList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      processServer.processList(param).then(function(res){
        $scope.pageLoading = false;
        $scope.processList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getProcessList();

    $scope.addProcess = function(params) {
      processServer.addProcessDialog(params).result.then(function(data){
        if(data){
          getProcessList();
        }
      })
    }
    
  }

  function addProcessDialogCtrl($scope, $state, processServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };

    $scope.entity = {};
    console.log(data);
    if(data&&data.id){
      $scope.isEdit = true;
      $scope.entity.Title = data.title;
      $scope.entity.Icon = data.icon;
    }

    $scope.rechoiseImg = function(imgsrc){
      $scope.entity.Icon = '';
    }

    $scope.upload = function(data){
      console.log("done upload img",data);
      if(data&&data.res&&data.res.data&&data.res.data.length){
        $scope.entity.Icon = data.res.data[0].imageUrl;
      }else {
        $toaster.warning("上传失败！请稍后重试")
      }
    }

    function addProcessFun(){
      processServer.addProcess($scope.entity).then(function(ret){
        $modalInstance.close(true);
        $toaster.success("添加成功");
      }, function(ret) {
        // $toaster.info(ret.msg);
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    function editProcessFun(){
      $scope.entity.id = data.id;
      processServer.editProcess($scope.entity).then(function(ret){
        $modalInstance.close(true);
        $toaster.success("修改成功");
      }, function(ret) {
        // $toaster.info(ret.msg);
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    $scope.eventformvalidate = {
      submitHandler: function () {
        console.log($scope.entity)
        if(!$scope.entity.Icon){
          $toaster.warning("请上传头像");
          return;
        } 
        $scope.saveloading = true;
        if(!$scope.isEdit){
          addProcessFun();
        }else{
          editProcessFun();
        }
      }
    }
  }

  function setProcessListCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster, processServer) {
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
        getProcessList();
    };

    function getProcessList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      processServer.processList(param).then(function(res){
        $scope.pageLoading = false;
        $scope.processList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getProcessList();

    $scope.addProcess = function(params) {
      processServer.addProcessDialog(params).result.then(function(data){
        if(data){
          getProcessList();
        }
      })
    }
    
  }

  function addSetProcessCtrl($scope, $state, processServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };

    $scope.entity = {};
    console.log(data);
    if(data&&data.id){
      $scope.isEdit = true;
      $scope.entity.Title = data.title;
      $scope.entity.Icon = data.icon;
    }

    $scope.rechoiseImg = function(imgsrc){
      $scope.entity.Icon = '';
    }

    $scope.upload = function(data){
      console.log("done upload img",data);
      if(data&&data.res&&data.res.data&&data.res.data.length){
        $scope.entity.Icon = data.res.data[0].imageUrl;
      }else {
        $toaster.warning("上传失败！请稍后重试")
      }
    }

    function addProcessFun(){
      processServer.addProcess($scope.entity).then(function(ret){
        $modalInstance.close(true);
        $toaster.success("添加成功");
      }, function(ret) {
        // $toaster.info(ret.msg);
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    function editProcessFun(){
      $scope.entity.id = data.id;
      processServer.editProcess($scope.entity).then(function(ret){
        $modalInstance.close(true);
        $toaster.success("修改成功");
      }, function(ret) {
        // $toaster.info(ret.msg);
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    $scope.eventformvalidate = {
      submitHandler: function () {
        console.log($scope.entity)
        if(!$scope.entity.Icon){
          $toaster.warning("请上传头像");
          return;
        } 
        $scope.saveloading = true;
        if(!$scope.isEdit){
          addProcessFun();
        }else{
          editProcessFun();
        }
      }
    }
  }

})();
