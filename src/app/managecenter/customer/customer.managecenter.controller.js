(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('customerCtrl', customerCtrl)
    .controller('delBachCustomerCtr', delBachCustomerCtr)
    .controller('addBachCustomerCtrl', addBachCustomerCtrl)
    .controller('addCustomerCtrl', addCustomerCtrl)
    .controller('editCustomerCtrl', editCustomerCtrl)
    .controller('delCustomerCtrl', delCustomerCtrl)
    .filter('showelepsis', ['$rootScope',function($rootScope) {
      return function(items) {
        if(items&&items.length<=20){
          return items;
        } else if(items&&items.length>20){
          return (items.substring(0,20)+"...");
        } else {
          return '';
        }
      };
    }])
  ;

  /* @ngInject */
  function customerCtrl($rootScope,$scope, $state, $config, tableHelp,customerServer, $timeout, $toaster) {

    $scope.$on('reload', function () {
      $state.reload();
    })
    $scope.searchparams={usename:''}
    var tableHelpExp = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    });
    $scope.tableParams = tableHelpExp.tableParams($config.apiCustomer.customerList, function() {
      var params = {
        params:{applicationCode:$rootScope.applicationCode}
      };
      if($scope.searchparams.usename) params.params.nickName = $scope.searchparams.usename;
      return params;
    });
    $scope.tableParams.count(10);
    /*批量按钮*/
    $scope.bachSearch=true;
    /*全选*/
    $scope.checkboxes ={
      checked:false,
      items:{}
    }
    $scope.selectAllChange=function(){
      var rulist = $scope.tableParams.data.recordList;
       $scope.cusUserNames = [];
      angular.forEach(rulist,function(item){
        if($scope.checkboxes.checked){
          $scope.bachSearch=false
         if(item.editable){
           $scope.checkboxes.items[item.id] = true
         }
        }else{
          $scope.bachSearch=true
          $scope.checkboxes.items[item.id] = false
        }
        if(item.editable){
          $scope.cusUserNames.push(item.userName)
        }
      })
    }
    /*单选*/
    $scope.selectItemChange = function() {
      var checked = 0,
        unchecked = 0,
        total = $scope.tableParams.data.recordList.length,
        rulist = $scope.tableParams.data.recordList;
      $scope.cusUserNames = [];
      angular.forEach(rulist, function(item) {
        checked += ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        if($scope.checkboxes.items[item.id]){
          $scope.cusUserNames.push(item.userName);
        }
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes.checked = (checked == total);
      }
      if(checked<total){
        $scope.bachSearch=false
        $scope.checkboxes.checked=false
      }
      if(checked == 0){
        $scope.bachSearch=true
      }
    };
      /*删除*/
    $scope.delCustomer=function(item){
      var params = {}
      if(item) params = item
      customerServer.delCustomer(params).result.then(function(ret){
        if(ret==true){
          $scope.tableParams.page(1);
          $scope.tableParams.reload();
        }
      })
    }
    /*新增*/
    $scope.addCustomer=function(){
      customerServer.addCustomer().result.then(function(ret){
        if(ret==true){
          $scope.tableParams.page(1);
          $scope.tableParams.reload();
        }
      })
    }
    /*编辑*/
    $scope.editCustomer=function(item){
      var params={};
      if(item){params=item};
      customerServer.editCustomer(params).result.then(function(ret){
        if(ret==true){
          $scope.tableParams.page(1);
          $scope.tableParams.reload();
        }
      })
    }
   $scope.customer ={bach:''}
   $scope.bach = function(item){
     /*批量新增*/
     if($scope.customer.bach =='add'){
       customerServer.addBachCustomer({userNames:$scope.cusUserNames}).result.then(function(ret){
         if(ret==true){
           $scope.tableParams.page(1);
           $scope.tableParams.reload();
         }
       })
     }
     /*批量删除*/
     if($scope.customer.bach =='del'){
       customerServer.delBachCustomer({list:$scope.cusUserNames}).result.then(function(ret){
         if(ret==true){
           $scope.tableParams.page(1);
           $scope.tableParams.reload();
         }
       })
     }
   }
    /*查询事件*/
    $scope.onSubmit = function(){
      $scope.tableParams.page(1);
      $scope.tableParams.reload();
    }
  }
  /* @ngInject */
  /*新增弹窗*/
  function addCustomerCtrl($rootScope,$scope,customerServer,$toaster, $modalInstance,ipCookie) {
    $scope.vm={};
    $scope.entry={};
    /*用户应用*/
    $scope.customerApplications = $rootScope.loginAuthData.applications || ipCookie(window.env.cookieName).applications;
    /*用户角色*/
    $scope.customerRoles = $rootScope.loginAuthData.roles || ipCookie(window.env.cookieName).roles;
    $scope.hideSwitch=true
    $scope.switchApp = function(){
      var arrRoles =[];
      angular.forEach($scope.entry.roles,function(item){
        arrRoles.push(item.defaultAllApplication)
      })
      if(arrRoles.indexOf(1)!=-1){
        $scope.hideSwitch=false
      }else{
        $scope.hideSwitch=true
      }
    }
    $scope.removed = function (item, model) {
      if(item.defaultAllApplication==1){
        $scope.hideSwitch=true
      }else{
        $scope.hideSwitch=true
      }
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var roles = $scope.entry.roles,
            applications = $scope.entry.applications,
            roleIds =[],
            applicationCodes =[];
        if(roles.length<1){
          $toaster.warning("用户角色不能为空");
          return false
        }
        var arrRoles =[];
        angular.forEach($scope.entry.roles,function(item){
          arrRoles.push(item.defaultAllApplication)
        })
        if(arrRoles.indexOf(1)==-1){
          if(applications.length<1){
            $toaster.warning("用户应用不能为空");
            return false
          }
        }
        angular.forEach(roles,function(item){
          roleIds.push(item.id)
        })
        angular.forEach(applications,function(item){
          applicationCodes.push(item.code)
        })
        $scope.vm.roles=roleIds;
        $scope.vm.applications=applicationCodes;
        var params = angular.copy($scope.vm);
        customerServer.customerAdd(params).then(function(ret){
          $toaster.success(ret.msg);
          $modalInstance.close(true);
        }, function(ret) {
          $toaster.info(ret.msg);
        }).finally(function() {
          $scope.saveloading = false;
        })
      }
    }
  }
  /* @ngInject */
  /*编辑弹窗*/
  function editCustomerCtrl($rootScope,$scope,customerServer,$toaster, $modalInstance,ipCookie,data) {
    /*用户应用*/
    $scope.customerApplications = $rootScope.loginAuthData.applications || ipCookie(window.env.cookieName).applications;
    /*用户角色*/
    $scope.customerRoles = $rootScope.loginAuthData.roles || ipCookie(window.env.cookieName).roles;
    $scope.vm={};
    $scope.entry={
      roles:[],
      applications:[]
    };
    if(data){
      $scope.vm.nickName=data.nickName;
      $scope.vm.userName=data.userName;
      $scope.vm.phone=data.phone;
      if(data.roleNamesStr==undefined){
        $scope.entry.roles.push([]);
        $scope.hideSwitch=true
      }else{
        angular.forEach(data.roleNamesStr.split(","),function(item){
          angular.forEach($scope.customerRoles,function(_item){
            if(_item.name==item){
              $scope.entry.roles.push(_item)
            }
          })
        })
      }
      if(data.applicationNamesStr==undefined){
        $scope.entry.applications.push([])
      }else{
        angular.forEach(data.applicationNamesStr.split(","),function(item){
          angular.forEach($scope.customerApplications,function(_item){
            if(_item.value==item){
              $scope.entry.applications.push(_item)
            }
          })
        })
      }
      var arrRoles =[];
      angular.forEach($scope.entry.roles,function(item){
        arrRoles.push(item.defaultAllApplication)
      })
      if(arrRoles.indexOf(1)!=-1){
        $scope.hideSwitch=false
      }else{
        $scope.hideSwitch=true
      }
      $scope.switchApp = function(){
        var arrRoles =[];
        angular.forEach($scope.entry.roles,function(item){
          arrRoles.push(item.defaultAllApplication)
        })
        if(arrRoles.indexOf(1)!=-1){
          $scope.hideSwitch=false
        }else{
          $scope.hideSwitch=true
        }
      }
      $scope.removed = function (item, model) {
        if(item.defaultAllApplication==1){
          $scope.hideSwitch=true
        }else{
          $scope.hideSwitch=true
        }
      };
    }
    if(data.nickName){$scope.editCustomerName=true}
    if(data.userName){$scope.editCustomerCount=true}
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var roles = $scope.entry.roles,
          applications = $scope.entry.applications,
          roleIds =[],
          applicationCodes =[];
        if(roles.length<1){
          $toaster.warning("用户角色不能为空");
          return false
        }
        var arrRoles =[];
        angular.forEach($scope.entry.roles,function(item){
          arrRoles.push(item.defaultAllApplication)
        })
        if(arrRoles.indexOf(1)==-1){
          if(applications.length<1){
            $toaster.warning("用户应用不能为空");
            return false
          }
        }
        angular.forEach(roles,function(item){
          roleIds.push(item.id)
        })
        angular.forEach(applications,function(item){
          applicationCodes.push(item.code)
        })
        $scope.vm.roles=roleIds;
        $scope.vm.applications=applicationCodes;
        $scope.vm.id=data.id
        var params = angular.copy($scope.vm);
        customerServer.customerEdit(params).then(function(ret){
          $toaster.success(ret.msg);
          $modalInstance.close(true);
        }, function(ret) {
          $toaster.info(ret.msg);
        }).finally(function() {
          $scope.saveloading = false;
        })
      }
    }
  }
  /* @ngInject */
  /*删除弹窗*/
  function delCustomerCtrl($scope,$state,customerServer,$toaster, $modalInstance,data){
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm ={};
    $scope.vm.usename = data.nickName
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params={
          list:[]
        };
        params.list.push(data.userName)
        customerServer.customerDelete(params).then(function(ret){
          $toaster.success(ret.msg);
          $state.reload();
          $modalInstance.close();
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }

  /* @ngInject */
  /*批量新增*/
  function addBachCustomerCtrl($rootScope,$scope,$state,customerServer,$toaster, $modalInstance,ipCookie,data){
    $scope.vm={};
    $scope.entry={};
    /*用户应用*/
    $scope.customerApplications = $rootScope.loginAuthData.applications || ipCookie(window.env.cookieName).applications;
    /*用户角色*/
    $scope.customerRoles = $rootScope.loginAuthData.roles || ipCookie(window.env.cookieName).roles;
    $scope.hideSwitch=true
    $scope.switchApp = function(){
      var arrRoles =[];
      angular.forEach($scope.entry.roles,function(item){
        arrRoles.push(item.defaultAllApplication)
      })
      if(arrRoles.indexOf(1)!=-1){
        $scope.hideSwitch=false
      }else{
        $scope.hideSwitch=true
      }
    }
    $scope.removed = function (item, model) {
      if(item.defaultAllApplication==1){
        $scope.hideSwitch=true
      }else{
        $scope.hideSwitch=false
      }
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var roles = $scope.entry.roles,
          applications = $scope.entry.applications,
          roleIds =[],
          applicationCodes =[];
        if(roles.length<1&&applications.length<1){
          $toaster.warning("用户角色和用户应用必填一个");
          return false
        }
        angular.forEach(roles,function(item){
          roleIds.push(item.id)
        })
        angular.forEach(applications,function(item){
          applicationCodes.push(item.code)
        })
        $scope.vm.roleIds=roleIds;
        $scope.vm.applicationCodes=applicationCodes;
        $scope.vm.userNames =data.userNames;
        var params = angular.copy($scope.vm);
        customerServer.bachCustomerAdd(params).then(function(ret){
          $toaster.success(ret.msg);
          $state.reload();
          $modalInstance.close();
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }
  /* @ngInject */
  /*批量删除*/
  function delBachCustomerCtr($scope,$state,customerServer,$toaster, $modalInstance,data){
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          list:data.list
        };
        customerServer.bachCustomerDelete(params).then(function(ret){
          $toaster.success(ret.msg);
          $state.reload();
          $modalInstance.close();
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }
})();
