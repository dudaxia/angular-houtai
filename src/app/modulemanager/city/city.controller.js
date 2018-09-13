(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('cityModuleManagerCtrl', cityModuleManagerCtrl)
    .controller('addCityDialogCtrl', addCityDialogCtrl)
  ;
  /* @ngInject */
  function cityModuleManagerCtrl($rootScope,$scope,modulemanageServer, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    function getCityList() {
      $scope.pageLoading = true;
      modulemanageServer.citylist().then(function(res){
        $scope.pageLoading = false;
        $scope.cityList = res.res.data;
      })
    }
    getCityList();

    $scope.addCity = function () {
      modulemanageServer.addCityDialog().result.then(function(data){
        if(data){
          getCityList();
        }
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
      console.log("address",$scope.address);
      if($scope.address.string){
        var adresStr = $scope.address.string.split('/');
        var param = {
          ProvinceArea: adresStr[0],
          CityArea: adresStr[1],
          CountyArea: adresStr[2]
        }
        console.log("param",param)
        modulemanageServer.addArea(param).then(function(res){
          $scope.saveloading = false;
          $modalInstance.close(true);
          $toaster.success("添加成功")
        },function(err){
          $scope.saveloading = false;
        })
      }else{
        $toaster.warning("请选择地址");
        $scope.saveloading = false;
      }
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
