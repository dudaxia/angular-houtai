(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('stationsManagementCtrl', stationsManagementCtrl)
    .controller('stationsUserListCtrl', stationsUserListCtrl)
    .controller('addStationsCtrl', addStationsCtrl)
    .controller('addStationsUserCtrl', addStationsUserCtrl)
  ;
  /* @ngInject */
  function stationsManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, organizationServer, $timeout, $toaster) {
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
        getStationsUserList();
    };

    function getStationsList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      organizationServer.stationlist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.stationsList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getStationsList();

    $scope.addStations = function() {
      organizationServer.addStationsDialog().result.then(function(data) {
        if(data){
          getStationsList();
        }
      })
    }

  }
  function stationsUserListCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, organizationServer, $timeout, $toaster) {
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
        getStationsList();
    };

    function getStationsUserList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
        Id: $stateParams.id
      }
      organizationServer.stationuserlist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.stationsUserList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getStationsUserList();

    $scope.addStationsUser = function () {
      organizationServer.addStationsUserDialog({RoleId:$stateParams.id}).result.then(function(data) {
        if(data){
          getStationsUserList();
        }
      })
    }

  }

  function addStationsCtrl($scope, $state,organizationServer, $toaster, $modalInstance,data) {
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

    $scope.eventformvalidate = {
      submitHandler: function () {
        console.log($scope.entity)
        $scope.saveloading = true;
        organizationServer.stationUserAdd($scope.entity).then(function(ret){
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

  function addStationsUserCtrl($scope, $state,organizationServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };

    $scope.entity = {};

    $scope.pageLoading = true;
    function getuserList() {
      var param = {
        PageNow: 1,
        PageSize: 100000,
      }
      organizationServer.userlist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.userRoleList = res.res.data.list;
      })
    }
    getuserList();

    function getAllSelectedUserIds(){
      var idsArr = [];
      angular.forEach($scope.userRoleList,function(item){
        if(item.isChecked){
          idsArr.push(item.id)
        }
      })
      var ids = idsArr.join(',')
      console.log('-----',ids)
      return ids;
    }

    $scope.test = function () {
      getAllSelectedUserIds();
    }

    $scope.eventformvalidate = {
      submitHandler: function () {
        $scope.saveloading = true;
        var ids = getAllSelectedUserIds()
        var params = {
          RoleId: data.RoleId,
          UserIds: ids
        }
        organizationServer.stationUserAddUser(params).then(function(ret){
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
