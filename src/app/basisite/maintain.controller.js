(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('maintainManagementCtrl', maintainManagementCtrl)
    .controller('productManagementCtrl', productManagementCtrl)
    .controller('addMaintainManagementCtrl', addMaintainManagementCtrl)
    .controller('delAddressDialogCtrl', delAddressDialogCtrl)
    .controller('addProductDialogCtrl', addProductDialogCtrl)
  ;
  /* @ngInject */
  function maintainManagementCtrl($rootScope,$scope,basisiteServer, $state, $stateParams, $config, tableHelp, $timeout, $toaster,$httpApi) {
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
  function addMaintainManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
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
  function productManagementCtrl($rootScope,$scope,basisiteServer, $state, $stateParams, $config, tableHelp, $timeout, $toaster,$httpApi) {
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
        getProductList();
    };

    function getProductList() {
      $scope.pageLoading = true;
      var param = {
        PageNow: $scope.page.pageIndex,
        PageSize: $scope.page.pageSize,
      }
      basisiteServer.productlist(param).then(function(res){
        $scope.pageLoading = false;
        $scope.productList = res.res.data.list;
        $scope.page.totalCnt = res.res.data.count;
      })
    }
    getProductList();

    $scope.addProduct = function(item) {
      var params = item || {};
      basisiteServer.addProductDialog(params).result.then(function(data){
        if(data){
          getProductList();
        }
      })
    }

    $scope.deleteaddress = function () {
      basisiteServer.delAddress().result.then(function(data){

      })
    }

  }
  function addProductDialogCtrl($rootScope,$scope, $timeout, $state, $sce,basisiteServer,$stateParams,$toaster,$httpApi,$config,data,$modalInstance) {
    $scope.cancel = function() {
        $modalInstance.dismiss('Canceled');
    };
    $scope.entity = {};
    // console.log(data)
    if(data&&data.id){
      $scope.isEdit = true;
      data.DicName = data.dicName;
      $scope.entity = data;
    }

    function addProductFun (){
      basisiteServer.addProduct({DicName:$scope.entity.DicName}).then(function(res){
        $modalInstance.close(true);
        $scope.saveloading = false;
      })
    }
    function editProductFun (){
      basisiteServer.editProduct({
        Id:$scope.entity.id,
        DicName:$scope.entity.DicName
      }).then(function(res){
        $modalInstance.close(true);
        $scope.saveloading = false;
      })
    }
    
    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          if(!$scope.isEdit){
            addProductFun();
          }else{
            editProductFun();
          }
          
        });
      }
    }
  }
})();
