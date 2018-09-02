(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('listManagementCtrl', listManagementCtrl)
    .controller('addListCtrl', addListCtrl)
    .controller('addDataCtrl', addDataCtrl)
    .controller('importCtrl', importCtrl)
    .controller('deleteListCtrl', deleteListCtrl)
    .controller('deleteDataCtrl', deleteDataCtrl)
    .filter('showelepsis', ['$rootScope',function($rootScope) {
      return function(items) {
          if(items&&items.length<=15){
            return items;
          } else if(items&&items.length>15){
            return (items.substring(0,15)+"...");
          } else {
            return '';
          }
      };
    }])
  ;

  /* @ngInject */
  function listManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    if($rootScope.loginAuthData){
      var permission = $rootScope.loginAuthData.permissions;
      if(permission.indexOf("sheetData")>-1&&permission.indexOf("sheet")<=-1){
        $scope.curTab = 2;
      }else{
        $scope.curTab = $stateParams.tab || 1;
      }
    }else{
      $scope.curTab = $stateParams.tab || 1;
    }
    $scope.selectTab = function(index) {
      $scope.curTab = index;
    };
    if($rootScope.applicationCode!=undefined){
      $scope.searchParams = {applicationCode: $rootScope.applicationCode};
    }else{
      $scope.searchParams = {applicationCode: ''};
    }
    listServer.sheetdataListDict($scope.searchParams).then(function (ret) {
      if (ret && ret.data) $scope.sheetdataList = ret.data.list || [];
    },function () {
    });

    var tableHelpExp = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    },function(ret){
    });
    $scope.vm={};
    var tableHelpExp2 = tableHelp($scope, {
      pageSize: 10,
      proxy: 'apiUrlPrefixStore'
    },function(ret){
      // console.log(ret)
      $scope.vm.maxSortNumber=ret.maxSortNumber;
      $scope.vm.minSortNumber=ret.minSortNumber;
      $scope.vm.currentPage=ret.currentPage;
    });

    $scope.tableParams = tableHelpExp.tableParams($config.apiList.sheetList, function() {
      var params = {
        params:{}
      };
      if ($scope.searchParams.applicationCode) params.params.applicationCode = $scope.searchParams.applicationCode;
      return params;
    });

    $scope.tableParams2 = tableHelpExp2.tableParams($config.apiList.sheetdataList, function() {
      var params = {
      };
      if ($scope.searchParams.applicationCode) params.applicationCode = $scope.searchParams.applicationCode;
      if ($scope.searchParams.sheetId) params.sheetId = $scope.searchParams.sheetId;
      if ($scope.searchParams.keyword) params.value = $scope.searchParams.keyword;
      params.minSortNumber=$scope.vm.minSortNumber;
      params.maxSortNumber=$scope.vm.maxSortNumber;
      params.jumpPage=$scope.vm.currentPage;
      // console.log($state.page)
      return params;
    });

    $scope.tableParams2.page(1);
    $scope.tableParams2.count(10);
    // $scope.onSearch = function () {
    //   $scope.tableParams.page(1);
    //   $scope.tableParams.reload();
    // };

    $scope.onSearch2 = function () {
      $scope.tableParams2.page(1);
      $scope.tableParams2.reload();
    };

    /*增加*/
    $scope.addList = function(type, item){
      var params = {};
      if (item) params = item;
      if(type==1){
        listServer.addList(params).result.then(function(ret){
            if(ret==true){
              $scope.tableParams.page(1);
              $scope.tableParams.reload();
            }
        })
      }
      if(type==2){
        listServer.addData(params).result.then(function(ret){
            if(ret==true){
              $scope.tableParams2.page(1);
              $scope.tableParams2.reload();
              $scope.curTab = 2;
            }
        })
      }
    }
   /*删除列表名*/
    $scope.deleteList = function(type, id,value){
      if(type==1){
        listServer.deleteList({id:id}).result.then(function(ret){
          if(ret==true){
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
          }
        })
      }
      if(type==2){
        listServer.deleteData({id:id,value:value}).result.then(function(ret){
          if(ret==true){
            $scope.tableParams2.page(1);
            $scope.tableParams2.reload();
            $scope.curTab == 2;
          }
        })
      }
    }
    /**/
    $scope.import = function(){
      listServer.import().result.then(function(ret){
        if(ret.code){
          // $state.reload();
          $scope.tableParams2.page(1);
          $scope.tableParams2.reload();
        }
      })
    }

    $scope.getDownUrl = function () {
      $scope.saveloading = true;
      var params = {};
      if ($scope.searchParams.sno) params.sno = $scope.searchParams.sno;
      if ($scope.searchParams.storeId) params.storeId = $scope.searchParams.storeId;

      if ($scope.searchParams.time.startDate) {
        params.startTime = moment(new Date($scope.searchParams.time.startDate)).format('YYYY-MM-DD') + ' 00:00:00';
        params.endTime = moment(new Date($scope.searchParams.time.endDate)).format('YYYY-MM-DD') + ' 23:59:59';
      }
      $scope.down = {};
      storeServer.microBook.exportVerifyRecord(params).then(function (ret) {
        $scope.down.fileName = ret.data.fileName;
        $scope.queryDownUrl();
      },function () {
        $toaster.warning('生成导出文件失败！');
      }).finally(function() {
        $scope.saveloading = false;
      })
    };

    $scope.queryDownUrl = function () {
      var param = {type: 'VERIFYRECORD'};
      storeServer.microBook.queryExcelStatus(param).then(function (ret) {
        if (ret.data.state == 0) {
          $timeout($scope.queryDownUrl, 1000);
        }
        else if (ret.data.state == 2) {
          // $scope.down.url = ret.data.url;
          $wmUtil.download(ret.data.url);
        }
        else {
          $toaster.warning('生成导出文件失败！');
        }
      },function () {
      });
    };
  }
  /* @ngInject */
  function addListCtrl($scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.vm = {
      typeCode:1
    }
    if (data && data.applicationCode!=undefined) $scope.vm.applicationCode = data.applicationCode;
    if (data && data.desc!=undefined) $scope.vm.desc = data.desc;
    if (data && data.name!=undefined) $scope.vm.name = data.name;
    if (data && data.typeCode!=undefined) $scope.vm.typeCode = data.typeCode;
    if (data && data.id!=undefined) $scope.vm.id = data.id;

    listServer.sheetEditDict({}).then(function (res) {
      if (res && res.data) $scope.appList = res.data.application;
      if (res && res.data) $scope.sheetList = res.data.sheetType;
    });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.listEdit = {
      submitHandler: function () {
        var params = {};
        if ($scope.vm && $scope.vm.applicationCode!=undefined) params.applicationCode = $scope.vm.applicationCode;
        if ($scope.vm && $scope.vm.desc!=undefined) params.desc = $scope.vm.desc;
        if ($scope.vm && $scope.vm.name!=undefined) params.name = $scope.vm.name;
        if ($scope.vm && $scope.vm.typeCode!=undefined) params.typeCode = $scope.vm.typeCode;
        if ($scope.vm && $scope.vm.id!=undefined) params.id = $scope.vm.id;
        if ($scope.vm && $scope.vm.id!=undefined){
          listServer.sheetModify(params).then(function(ret){
            $toaster.success(ret.msg);
            $modalInstance.close(true);
            $state.reload();
          }, function() {
          }).finally(function() {
              $scope.saveloading = false;
          })
        }else{
          listServer.sheetAdd(params).then(function(ret){
            $toaster.success(ret.msg);
            $modalInstance.close(true);
            $state.reload();
          }, function() {
          }).finally(function() {
              $scope.saveloading = false;
          })
        }
      }
    }
  }
  /* @ngInject */
  /*删除列表sheet弹窗*/
  function deleteListCtrl($scope, $state,listServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        listServer.sheetDelete(params).then(function(ret){
          $toaster.success(ret.msg);
          //$state.reload();
          $modalInstance.close(true);
        }, function(ret) {
          // $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }
  /* @ngInject */
  /*删除数据sheet*/
  function deleteDataCtrl($scope, $state,listServer, $toaster, $modalInstance,data) {
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id,
          value:data.value
        };
        listServer.sheetdataDelete(params).then(function(ret){
          $toaster.success(ret.msg);
          //$state.reload();
          $modalInstance.close(true);
        }, function(ret) {
          $toaster.info(ret.msg);
        }).finally(function() {

        })
      }
    }
  }
  /* @ngInject */
  function addDataCtrl($scope, $state, $stateParams, $config, tableHelp,topheaderServer,listServer, $timeout, $toaster, $modalInstance, $locale,data) {
    $scope.vm = {

    }
    if (data && data.applicationCode!=undefined){
      $scope.vm.applicationCode = data.applicationCode;
      listServer.sheetdataListDict({applicationCode:$scope.vm.applicationCode}).then(function (ret) {
        if (ret && ret.data) $scope.sheetdataList = ret.data.list;
      },function () {
      });
    }
    if (data && data.desc!=undefined) $scope.vm.desc = data.desc;
    if (data && data.value!=undefined) $scope.vm.value = data.value;
    if (data && data.sheetId!=undefined) $scope.vm.sheetId = data.sheetId;
    if (data && data.value!=undefined) $scope.vm.oldValue = data.value;
    if (data && data.id!=undefined) $scope.vm.id = data.id;
    $scope.applicationCode = function(item){
      listServer.sheetdataListDict({applicationCode:item}).then(function (ret) {
        if (ret && ret.data) $scope.sheetdataList = ret.data.list;
      },function () {
      });
    }
    /*listServer.sheetEditDict().then(function (res) {
      //if (res && res.data) $scope.appList = res.data.application;
      if (res && res.data) $scope.sheetList = res.data.sheetType;
    });*/
    topheaderServer.dictApplicaitonList().then(function (res) {
      if (res && res.data) $scope.appList = res.data.list
    }, function(error) {
    }).finally(function() {
    })

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.listEdit = {
      submitHandler: function () {
        var params = {};
        if ($scope.vm && $scope.vm.applicationCode!=undefined) params.applicationCode = $scope.vm.applicationCode;
        if ($scope.vm && $scope.vm.desc!=undefined) params.desc = $scope.vm.desc;
        if ($scope.vm && $scope.vm.value!=undefined) params.value = $scope.vm.value;
        if ($scope.vm && $scope.vm.sheetId!=undefined) params.sheetId = $scope.vm.sheetId;
        if ($scope.vm && $scope.vm.oldValue!=undefined) params.oldValue = $scope.vm.oldValue;
        if ($scope.vm && $scope.vm.id!=undefined) params.id = $scope.vm.id;
        if ($scope.vm && $scope.vm.id!=undefined){
          listServer.sheetdataModify(params).then(function(ret){
            $toaster.success(ret.msg);
            $modalInstance.close(true);
            // $state.reload();
          }, function() {
          }).finally(function() {
              $scope.saveloading = false;
          })
        }else{
          listServer.sheetdataAdd(params).then(function(ret){
            $toaster.success(ret.msg);
            $modalInstance.close(true);
            // $state.reload();
          }, function() {
          }).finally(function() {
              $scope.saveloading = false;
          })
        }

      }
    }
  }
  /* @ngInject */
  function importCtrl($scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster, $modalInstance, $locale, data, $upload, $rootScope) {
    $scope.vm = {

    }
    if (data && data.applicationCode!=undefined) $scope.vm.applicationCode = data.applicationCode;
    if (data && data.desc!=undefined) $scope.vm.desc = data.desc;
    if (data && data.name!=undefined) $scope.vm.name = data.name;
    if (data && data.typeCode!=undefined) $scope.vm.typeCode = data.typeCode;
    if (data && data.sheetName!=undefined) $scope.vm.name = data.sheetName;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.set = function(setdata){
      var userData = $rootScope.locals.userData;
      setdata.freLoading=true;
      if (!setdata.files) return;
      var fileRema = function() {
        return setdata.maxCount - setdata.fileList.length;
      };
      var remaining = fileRema();
      if (remaining < setdata.files.length) {
          $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
          return false;
      };
      for (var i = 0; i < setdata.files.length; i++) {
        var file = setdata.files[i];
        file.success=true;
        if(file.size/(1024*1024)>setdata.maxSizeFile){
          $toaster.info($locale.FORMTIPS.uplodSizeMax.format(setdata.maxSizeFile));
        }else{
          file.success=false;
          var upload = $upload.upload({
            url: setdata.url || $config.api3.batchImportOption,
            fields: setdata.uploadParams,
            file: file,
            fileFormDataName: "csv"

          }).progress(function(evt) {
            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            setdata.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

          }).success(function(data, status, headers, config) {
              config.file.success=true;
              //TODO 判断成功上传 后再添加 +
              if(data.code == "0"){
                  // setdata.fileList.push(data.data);
                  $toaster.info(data.msg);
              }else{
                  $toaster.warning(data.msg);
              }
              setdata.freLoading = false;
              $modalInstance.close({code:true});
          }).error(function(data, status, headers, config) {
              config.file.success=true;
              $modalInstance.dismiss('cancel');
              //移除
          });
        }

      }
    }
  }

})();
