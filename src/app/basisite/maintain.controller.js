(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('maintainManagementCtrl', maintainManagementCtrl)
    .controller('productManagementCtrl', productManagementCtrl)
    .controller('addMaintainManagementCtrl', addMaintainManagementCtrl)
    .controller('delAddressDialogCtrl', delAddressDialogCtrl)
  ;
  /* @ngInject */
  function maintainManagementCtrl($rootScope,$scope,basisiteServer, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster,$httpApi) {
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

    function getAddressList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      basisiteServer.basisitelist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.addressList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getAddressList();


    $scope.address={
      province:'',
      city:'',
      district:'',
      street:'',
      string:''
    }
    $scope.deleteaddress = function () {
      basisiteServer.delAddress().result.then(function(data){

      })
    }

  }
  function addMaintainManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.zhanAddress = '';
    $scope.zhanAddressData = [
      {value:'',name:'请选择'},
      {value:1,name:'美女'},
      {value:2,name:'野兽'},
      {value:3,name:'秋林'},
      {value:4,name:'格瓦斯'},
      {value:5,name:'哇哈哈'}
    ]

    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.saveloading = true;
        $scope.$apply(function() {
          $scope.saveloading = true;
          $toaster.success("添加成功");
          $timeout(function(){
            $state.go("app.basisite.maintain")
          },1000)

        });
      }
    }

  }
  function delAddressDialogCtrl($rootScope,$scope, $timeout, $state, $sce,modulemanageServer,$stateParams,$toaster,$httpApi,$config,data,$modalInstance) {
    $scope.cancel = function() {
        $modalInstance.dismiss('Canceled');
    };
    $scope.address={
      province:'',
      city:'',
      district:'',
      street:'',
      string:''
    }
    
    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          $toaster.success("删除成功");
          $timeout(function(){
            $modalInstance.close(true);
          },1000)
          
        });
      }
    }
  }
  function productManagementCtrl($rootScope,$scope,basisiteServer, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster,$httpApi) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.pageLoading = true;
    $scope.pageLoading = false;
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

    // function getAddressList() {
    //   $scope.pageLoading = true;
    //   var param = {
    //     PageNow: $scope.page.pageIndex,
    //     PageSize: $scope.page.pageSize,
    //   }
    //   basisiteServer.basisitelist(param).then(function(res){
    //     $scope.pageLoading = false;
    //     $scope.addressList = res.res.data.list;
    //     $scope.page.totalCnt = res.res.data.count;
    //   })
    // }
    // getAddressList();


    $scope.address={
      province:'',
      city:'',
      district:'',
      street:'',
      string:''
    }
    $scope.deleteaddress = function () {
      basisiteServer.delAddress().result.then(function(data){

      })
    }

  }
})();
