(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('feedbackMessageCtrl', feedbackMessageCtrl)
  ;
  /* @ngInject */
  function feedbackMessageCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, basisiteServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.pageLoading = true;
    $scope.page={
        pageIndex:1,    //当前页索引。
        pageSize:10,    //单页记录条数
        totalCnt:10    //总记录数，这个是关键。必传
    }
    /**
     * 分页索引改变事件。业务开发通过此回调重新加载数据。
     */
    $scope.onPageIndexChanged=function(){
      // console.log($scope.page)
        getFeedbackList();
    };

    function getFeedbackList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      basisiteServer.feedbacklist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.feedbackList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getFeedbackList();

    $scope.chuliFeedback = function(params){
      basisiteServer.chulifeedback({Id:params.id}).then(function(res){
        $toaster.success("处理成功");
        getFeedbackList();
      },function(err){
        $toaster.info("处理失败")
      })
    }
    
  }
})();
