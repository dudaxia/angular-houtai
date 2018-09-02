(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('roleCtrl', roleCtrl)
    .controller('addRoleCtrl', addRoleCtrl)
    .controller('delRoleCtrl', delRoleCtrl)
    .directive('calHeight', ['$interval', '$filter', '$locale', 'formatTimefun', function($interval, $filter, $locale, formatTimefun) {
      return {
        restrict: 'AE',
        scope: {
            indata: '=?'
        },
        link: function(scope, iEle, attrs, ngModelCtrl) {
          var calNum = scope.indata.length==0 ? 1 : scope.indata.length;
          iEle.css({
            "height": calNum*36+"px",
            "line-height": calNum*36+"px"
          })
        }
      };
    }])
    .directive('permission', ['ipCookie', function(ipCookie) {
      return {
        restrict: 'AE',
        scope: {
            indata: '=?'
        },
        link: function(scope, iEle, attrs, ngModelCtrl) {
          scope.$watch('indata',function(newVal){
            if(scope.indata){
              var permissionData = scope.indata.permissions; 
              var btndesc = attrs.btndesc;
              if(btndesc){
                var btndescArr = btndesc.split(",");
                var isExistArr = [],
                    roleBtnIsAble="canuse";
                angular.forEach(btndescArr,function(item){
                  var itemIsExist = permissionData.indexOf(item)>-1;
                  isExistArr.push(itemIsExist);
                  // rule:disable,rule:enable
                  if(item=="rule:disable"||item=="rule:enable"){
                    if(!itemIsExist) {
                      roleBtnIsAble="cannotuse";
                    }
                  }
                })
                var isExist = isExistArr.indexOf(true)>-1;
                if(!isExist){
                  if(roleBtnIsAble=="cannotuse"){
                    $(iEle.children("div").get(0)).removeClass("open1").addClass("close1");
                    $($(iEle.children("div").get(0)).children("div").get(0)).removeClass("open2").addClass("close2");
                  } else {
                    iEle.addClass("hide");
                  }
                }
            }
            }
          })
        }
      };
    }])

  ;

  /* @ngInject */
  function roleCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, roleServer, $timeout, $toaster,ipCookie) {
    /*事件类型查询*/
    $scope.vm = {
      params: {
        keywords: ""
      }
    }
    var tableHelpExp = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    });
    $scope.tableParams = tableHelpExp.tableParams($config.role.roleList, function() {  //$config.apiPolicy.strategyList,   //$config.role.roleList
      var params = {
        params: {
          name:""
        }
      };
      if ($scope.vm.params.keywords){
        params.params.name = $scope.vm.params.keywords
      }
      return params;
    });
    $scope.onSearch = function(){
      $scope.tableParams.page(1);
      $scope.tableParams.reload();
    }
    /*新增事件*/
    $scope.addRole = function(params){
      var indialogparam = {};
      if(params&&params.id){
        indialogparam.id = params.id;
        indialogparam.name = params.name;
      }
      roleServer.addRole(indialogparam).result.then(function(ret){
          if(ret==true){
            $scope.onSearch();
          }
      })
    }
    $scope.deleteRole = function(params){
      roleServer.delRoleListItem(params).result.then(function(ret){
          if(ret==true){
            $scope.onSearch();
          }
      })
    }
  }
  /* @ngInject */
  function addRoleCtrl($scope, $state, $stateParams, $config, tableHelp, roleServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = data;
    $scope.isEdit = data.id ? true : false;
    $scope.loading = true;
    if($scope.isEdit) {
      // 编辑
      getRoleDict($scope.vm);
    } else {
      // 新增
      getRoleDict();
    }
    function getRoleDict(params) {
      // var params = queryParams||{};
      // if(id) params.id = id;
      roleServer.roleInfo(params).then(function(res){
        $scope.vm = res.data;
        $scope.loading = false;
      },function(res){

      })
    }
    $scope.selectAllChildren = function(params) {
      if(params.isChecked) {
        angular.forEach(params.sonModels,function(item){
          angular.forEach(item.sonModels,function(_item){
            _item.isChecked = true;
          })
        })
      } else {
        angular.forEach(params.sonModels,function(item){
          angular.forEach(item.sonModels,function(_item){
            _item.isChecked = false;
          })
        })
      }
    }
    $scope.isParentChecked = function (params) {
      var isCheckedCount = 0, childrenCount = 0;
      angular.forEach(params.sonModels,function(item){
        angular.forEach(item.sonModels,function(_item){
          childrenCount++;
          if(_item.isChecked){
            isCheckedCount++;
          }
        })
      });
      params.isChecked = childrenCount == isCheckedCount;
    }
    function getCheckedId(params) {
      var checkedIdArr = [];
      angular.forEach(params,function(item){
        angular.forEach(item.sonModels,function(_item){
          angular.forEach(_item.sonModels,function(__item){
            if(__item.isChecked) {
              var itemId = {};
              itemId.id = __item.id;
              checkedIdArr.push(itemId);
            }
          })
        })
      })
      return checkedIdArr;
    }
    function sureAddOrEdit(params) {
      if($scope.isEdit) {
        roleServer.editRole(params).then(function(ret){
          $toaster.success(ret.msg);
          $modalInstance.close(true);
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      } else {
        roleServer.sureAddRole(params).then(function(ret){
          $toaster.success(ret.msg);
          $modalInstance.close(true);
        }, function() {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {},
        checkIdArr = getCheckedId($scope.vm.list);
        params.permissionSet = checkIdArr;
        if($scope.isEdit) params.id = data.id;
        if(!$scope.isEdit) params.name = $scope.vm.name;
        sureAddOrEdit(params);
      }
    }
  }
  /* @ngInject */
  function delRoleCtrl($scope, $state, $stateParams, $config, tableHelp, roleServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = angular.copy(data)||{};
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        roleServer.delRole(params).then(function(ret){
          $toaster.success(ret.msg);
          $modalInstance.close(true);
        }, function(ret) {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }


})();
