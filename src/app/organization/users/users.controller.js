(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('usersManagementCtrl', usersManagementCtrl)
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

    
  }
})();
