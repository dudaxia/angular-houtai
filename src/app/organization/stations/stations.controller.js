(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('stationsManagementCtrl', stationsManagementCtrl)
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
        getStationsList();
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


    
  }
})();
