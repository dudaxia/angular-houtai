(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('companyManagementCtrl', companyManagementCtrl)
    .controller('deleteOrganizationListCtrl', deleteOrganizationListCtrl)
  ;
  /* @ngInject */
  function companyManagementCtrl($rootScope,$scope,organizationServer, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.entity = {};
    $scope.pageLoading = true;
    $scope.addCompanyFun = function() {
      $scope.entity = {};
      $scope.addCompany = true;
    }

    function getCompanyList() {
      $scope.pageLoading = true;
      organizationServer.getCompanyList().then(function(res){
        $scope.pageLoading = false;
        $scope.subtreeData = res.res.data||[];
        if($scope.subtreeData.length){
          var initSubTree = $scope.subtreeData[0];
          $scope.getCompanyDetail(initSubTree.id,initSubTree.level)
        }
      })
    }
    getCompanyList();
    // s省市区
    $scope.getAreaListFun = function() {
      organizationServer.getAreaList().then(function(res){
        $scope.provinceAreaList = res.res.data;
      },function(err){

      })
    }
    $scope.getAreaListFun();
    $scope.getAreaListChange = function(pid) {
      console.log(pid);
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
    // 下拉公司选项
    function companyAllList() {
      // $scope.pageLoading = true;
      organizationServer.companyList().then(function(res){
        // $scope.pageLoading = false;
        if(res&&res.res){
          $scope.companyAllListData = res.res.data||[];
        }else{
          $toaster.warning("数据格式错误！")
        }
      })
    }
    companyAllList();

    $rootScope.$on("queryCompanyDetail",function(e,params){
      var id = params.id;
      var level = params.level;
      $scope.getCompanyDetail(id,level);
    })

    $scope.getCompanyDetail =function(id,level) {
      $scope.addCompany = false;
      $scope.addApart = false;
      console.log("getCompanyDetail",id,level);
      if(level==1){
        // console.log("获取公司详情")
        $scope.isCompany = true;
        getCompanyById(id);
      }else if(level==2){
        // console.log("获取部门详情")
        $scope.isCompany = false;
        getApartmentById(id);
      }
    }
    function getCompanyById(id){
      organizationServer.getCompanyDetail({Id:id}).then(function(res){
        if(res&&res.res){
          $scope.entity = res.res.data||{};
        }
      })
    }
    function getApartmentById(id){
      organizationServer.getApartmentDetail({Id:id}).then(function(res){
        if(res&&res.res){
          $scope.entity = res.res.data||{};
        }
      })
    }

    $rootScope.$on("addDepartment",function(e,params){
      $scope.entity = {};
      $scope.addApart = true;
      $scope.isCompany = false;
      $scope.addCompany = false;
      var data = params.data;
      $scope.entity.companyId = data.id;
      console.log("addDepartment",data)
      var sortNum = getApartNum(data.id);
      var addApartParam = {
        CompanyId: data.id,
        SortNum: parseInt(sortNum)+1,
        DepartmentName: $scope.entity.name
      }
    })

    var getApartNum = function(id) {
      var apartNum = 0;
      angular.forEach($scope.subtreeData,function(item){
        if(item.id==id&&item.subData){
          apartNum = item.subData.length;
        }
      })
      return apartNum;
    }

    $scope.deleteList = function (id) {
       organizationServer.deleteList({id:id}).result.then(function(data){

       });
    }

    $scope.upload = function(data){
      console.log("done upload img",data);
      if(data&&data.res&&data.res.data&&data.res.data.length){
        $scope.entity.logo = data.res.data[0].imageUrl;
        $scope.entity.isDel = false;
      }else {
        $toaster.warning("上传失败！请稍后重试")
      }
    }

    $scope.rechoiseImg = function (param,isAddCompany){
      console.log(param)
      param.isDel = true;
    }

    function addCompanyAjax() {
      var postData = {
        CompanyName: $scope.entity.name,
        CompanyLogo: $scope.entity.logo,
        ProvinceAreaId: $scope.entity.ProvinceAreaId,
        CityAreaId: $scope.entity.CityAreaId,
      }
      organizationServer.createCompany(postData).then(function(result){
        getCompanyList();
      }, function(){
        $toaster.info("创建失败！")
      }).finally(function() {
        $scope.addCompany = false;
        $scope.saveloading = false;
      })
    }

    function addApartmentAjax() {
      var postData = {
        CompanyName: $scope.entity.name,
        CompanyLogo: $scope.entity.logo,
        SortNum: $scope.entity.SortNum
      }
      organizationServer.createApart(postData).then(function(result){
        getCompanyList();
      }, function(){
        $toaster.info("创建失败！")
      }).finally(function() {
        $scope.addApart = false;
        $scope.saveloading = false;
      }) 
    }

    function editCompany (){
      var postData = {
        CompanyName: $scope.entity.name,
        CompanyLogo: $scope.entity.logo,
        ProvinceAreaId: $scope.entity.ProvinceAreaId,
        CityAreaId: $scope.entity.CityAreaId,
      }
      organizationServer.elitCompany(postData).then(function(result){
        getCompanyList();
      }, function(){
        $toaster.info("修改失败！")
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    function editApartment() {
      var postData = {
        CompanyName: $scope.entity.name,
        CompanyLogo: $scope.entity.logo,
        SortNum: $scope.entity.SortNum
      }
      organizationServer.editApartment(postData).then(function(result){
        getCompanyList();
      }, function(){
        $toaster.info("修改失败！")
      }).finally(function() {
        $scope.saveloading = false;
      })
    }

    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          if($scope.addCompany&&!$scope.addApart){
            addCompanyAjax();
          }else if($scope.addApart&&!$scope.addCompany){
            addApartmentAjax();
          } if(!$scope.addCompany&&!$scope.addApart&&$scope.isCompany){
            // 编辑公司
            editCompany();
          } else if(!$scope.addCompany&&!$scope.addApart&&!$scope.isCompany){
            // 编辑部门
            editApartment();
          }
        })
      }
    }

  }

  function deleteOrganizationListCtrl($scope, $state,listServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        $modalInstance.close(true);
        $toaster.success("删除成功");
        // listServer.sheetDelete(params).then(function(ret){
        //   $toaster.success(ret.msg);
        //   //$state.reload();
        //   $modalInstance.close(true);
        // }, function(ret) {
        //   // $toaster.info(ret.msg);
        // }).finally(function() {

        // })
      }
    }
  }
})();
