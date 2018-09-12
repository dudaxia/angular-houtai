(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('usersManagementCtrl', usersManagementCtrl)
    .controller('addUserCtrl', addUserCtrl)
    .filter('hasFaceReg',function(){
        return function(status){
          var str = '';
          if(status == 0){
              str = '未认证';
          }else if(status == 1){
              str = '已认证'
          }
          return str;
        }
    })
  ;
  /* @ngInject */
  function usersManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, organizationServer, $timeout, $toaster) {
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
        getuserList();
    };

    function getuserList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      organizationServer.userlist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.userList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getuserList();

    $scope.addUserFun = function() {
      organizationServer.addUserDialog().result.then(function(data){
        if(data){
          getuserList();
        }
      })
    }

    
  }

  function addUserCtrl($scope, $state,organizationServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };

    $scope.entity = {};

    // s省市区
    $scope.getAreaListFun = function() {
      organizationServer.getAreaList().then(function(res){
        $scope.provinceAreaList = res.res.data;
      },function(err){

      })
    }
    $scope.getAreaListFun();
    $scope.getAreaListChange = function(pid) {
      angular.forEach($scope.provinceAreaList,function(item){
        if(item.id==pid){
          $scope.cityAreaList = item.subList;
        }
      })
    }
    $scope.getAreaAreaListChange = function(cid){
      angular.forEach($scope.cityAreaList,function(item){
        if(item.id==cid){
          $scope.areaAreaList = item.subList;
        }
      })
    }

    $scope.upload = function(data){
      console.log("done upload img",data);
      if(data&&data.res&&data.res.data&&data.res.data.length){
        $scope.entity.UserPhoto = data.res.data[0].imageUrl;
      }else {
        $toaster.warning("上传失败！请稍后重试")
      }
    }

    $scope.eventformvalidate = {
      submitHandler: function () {
        console.log($scope.entity)
        $scope.saveloading = true;
        organizationServer.addUser($scope.entity).then(function(ret){
          $modalInstance.close(true);
          $toaster.success("添加成功");
        }, function(ret) {
          // $toaster.info(ret.msg);
        }).finally(function() {
          $scope.saveloading = false;
        })
      }
    }
  }
})();
