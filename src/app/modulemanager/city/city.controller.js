(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('cityModuleManagerCtrl', cityModuleManagerCtrl)
    .controller('addCityDialogCtrl', addCityDialogCtrl)
  ;
  /* @ngInject */
  function cityModuleManagerCtrl($rootScope,$scope,modulemanageServer, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })

    function getCityList() {
      modulemanageServer.citylist().then(function(res){
        $scope.cityList = res.res.data;
      })
    }
    getCityList();

    $scope.addCity = function () {
      modulemanageServer.addCityDialog().result.then(function(data){

      })
    } 
  }
  function addCityDialogCtrl($rootScope,$scope, $timeout, $state, $sce,modulemanageServer,$stateParams,$toaster,$httpApi,$config,data,$modalInstance) {
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
    console.log("addComponentDialogCtrl data",data)
    $scope.isEdit = data&&data.id;
    if($scope.isEdit){
      $scope.entity = data;
    }else{
      $scope.entity = {};
    }
    function addComponent () {
      console.log("address",$scope.address)
      // configurationServer.addComponent({name:$scope.entity.name,code:$scope.entity.code}).then(function(res){
        $scope.saveloading = false;
        // $modalInstance.close(true);
      //   $toaster.success("添加成功")
      // },function(err){
      //   $scope.saveloading = false;
      // })
    }
    function updateComponent () {
      // configurationServer.updateComponent({id:data.id,name:$scope.entity.name,code:$scope.entity.code}).then(function(res){
      //   $scope.saveloading = false;
        $modalInstance.close(true);
      //   $toaster.success("添加成功")
      // },function(err){
      //   $scope.saveloading = false;
      // })
    }
    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          if($scope.isEdit){
            updateComponent();
          }else{
            addComponent();
          }
        });
      }
    }
  }

})();
