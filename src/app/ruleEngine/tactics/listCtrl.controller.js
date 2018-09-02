(function() {
  'use strict';
  angular.module('ngTicket').controller('addTacticsCtrl', addTacticsCtrl);
  /* @ngInject */
  function addTacticsCtrl($scope, $state, $stateParams, $config, tableHelp, policyServer, tacticsServer, $timeout, $toaster,listServer) {
    //基础设置
    $scope.vm = {};
    if($stateParams.name!=undefined) $scope.vm.name = $stateParams.name;
    if($stateParams.id!=undefined) $scope.vm.id = parseInt($stateParams.id);
    if($stateParams.riskThresholdList!=undefined) $scope.vm.thresholds = $stateParams.riskThresholdList;
    if($stateParams.applicationCode!=undefined) $scope.vm.applicationCode = parseInt($stateParams.applicationCode);
    if($stateParams.eventCode!=undefined) $scope.vm.eventCode = parseInt($stateParams.eventCode);
    if($stateParams.desc!=undefined) $scope.vm.desc = $stateParams.desc;
    if($stateParams.identificationCode!=undefined) $scope.vm.identificationCode = $stateParams.identificationCode;
    if($stateParams.riskTypeCode!=undefined) $scope.vm.riskTypeCode = parseInt($stateParams.riskTypeCode);
    if($stateParams.patternCode!=undefined) $scope.vm.patternCode = parseInt($stateParams.patternCode);
    policyServer.strategyEditDict().then(function (res) {
      if (res && res.data) $scope.applicationList = res.data.application;
      if (res && res.data) $scope.eventList = res.data.event;
      if (res && res.data) $scope.patternList = res.data.pattern;
      if (res && res.data) $scope.riskTypeList = res.data.riskType;
      // if (res && res.data) $scope.appList = res.data.application;
      // if (res && res.data) $scope.sheetList = res.data.sheetType;
    });
    if ($scope.vm && $scope.vm.thresholds && String($scope.vm.thresholds).length>2 && $scope.vm.patternCode==2){
      $scope.vm.thresholds = angular.fromJson($scope.vm.thresholds);
      $scope.vm.maxLevel = $scope.vm.thresholds.length;
      $scope.maxLevel = [];
      for (var i = 0; i <= $scope.vm.maxLevel; i++) {
        $scope.maxLevel.push({id:i});
      }
    }else{
      var params = {}
      params.eventCode = $scope.vm.eventCode;
      params.patternCode = $scope.vm.patternCode;
      if(params.eventCode!=undefined&&params.patternCode!=undefined){
        policyServer.strategyEditLevel(params).then(function(ret){
          if (ret.data && ret.data.maxLevel) {
            $scope.vm.maxLevel = ret.data.maxLevel;
            $scope.maxLevel = [];
            for (var i = 0; i <= $scope.vm.maxLevel; i++) {
              $scope.maxLevel.push({id:i});
            }
          }
          if (ret.data && ret.data.thresholds){
            $scope.vm.thresholds = ret.data.thresholds;
          }else{
            $scope.vm.thresholds = [];
          }
        }, function() {
        }).finally(function() {
        })
      }
    }


    $scope.riskLevel = function(eventCode,patternCode){
      var params = {}
      params.eventCode = eventCode;
      params.patternCode = patternCode;
      if(params.eventCode!=undefined&&params.patternCode!=undefined){
        policyServer.strategyEditLevel(params).then(function(ret){
          if (ret.data && ret.data.maxLevel) {
            $scope.vm.maxLevel = ret.data.maxLevel;
            $scope.maxLevel = [];
            for (var i = 0; i <= $scope.vm.maxLevel; i++) {
              $scope.maxLevel.push({id:i});
            }
          }
          if (ret.data && ret.data.thresholds){
            $scope.vm.thresholds = ret.data.thresholds;
          }else{
            $scope.vm.thresholds = [];
          }
        }, function() {
        }).finally(function() {
        })
      }
    }

    $scope.changeThresholds=function(item,index){
      $scope.vm.thresholds[index] = parseInt(item);
    }
    $scope.listEdit = {
      submitHandler: function () {
        var params = {};
        if ($scope.vm && $scope.vm.applicationCode!=undefined) params.applicationCode = $scope.vm.applicationCode;
        if ($scope.vm && $scope.vm.eventCode!=undefined) params.eventCode = $scope.vm.eventCode;
        if ($scope.vm && $scope.vm.desc!=undefined) params.desc = $scope.vm.desc;
        if ($scope.vm && $scope.vm.identificationCode!=undefined) params.identificationCode = $scope.vm.identificationCode;
        if ($scope.vm && $scope.vm.markCode!=undefined) params.markCode = $scope.vm.markCode;
        if ($scope.vm && $scope.vm.name!=undefined) params.name = $scope.vm.name;
        if ($scope.vm && $scope.vm.riskTypeCode!=undefined) params.riskTypeCode = $scope.vm.riskTypeCode;
        if ($scope.vm && $scope.vm.patternCode!=undefined) params.patternCode = $scope.vm.patternCode;
        if ($scope.vm && $scope.vm.thresholds!=undefined) params.riskThresholdList = $scope.vm.thresholds;
        if ($scope.vm && $scope.vm.id!=undefined) params.id = $scope.vm.id;
        tacticsServer.strategyModify(params).then(function(ret){
            $toaster.success(ret.msg);
        }, function() {
        }).finally(function() {
            $scope.saveloading = false;
        })
      }
    }
  }
  angular.module('ngTicket').controller('addRuleCtrl', addRuleCtrl);
  /* @ngInject */
  function addRuleCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, policyServer, $timeout, $toaster,listServer,tacticsServer) {
    //规则管理
    $scope.entity = {};
    // $scope.entity.id = 1;
    // $scope.entity.relation = 0;
    $scope.vm = {};
    if($stateParams.name!=undefined) $scope.vm.name = $stateParams.name;
    if($stateParams.id!=undefined) $scope.vm.id = parseInt($stateParams.id);
    if($stateParams.riskThresholdList!=undefined) $scope.vm.thresholds = $stateParams.riskThresholdList;
    if($stateParams.applicationCode!=undefined) $scope.vm.applicationCode = parseInt($stateParams.applicationCode);
    if($stateParams.eventCode!=undefined) $scope.vm.eventCode = parseInt($stateParams.eventCode);
    if($stateParams.desc!=undefined) $scope.vm.desc = $stateParams.desc;
    if($stateParams.identificationCode!=undefined) $scope.vm.identificationCode = $stateParams.identificationCode;
    if($stateParams.riskTypeCode!=undefined) $scope.vm.riskTypeCode = parseInt($stateParams.riskTypeCode);
    if($stateParams.patternCode!=undefined) $scope.vm.patternCode = parseInt($stateParams.patternCode);

    $scope.ruleList=[];

    //编辑状态按钮置灰
    $scope.buttonAdd = false;

    $scope.eventCode=[
      {value:"全部事件",code:0},
      {value:"本事件",code:$scope.vm.eventCode}
    ]
    $scope.applicationCode=[
      {value:"全部应用",code:0},
      {value:"本应用",code:$scope.vm.applicationCode}
    ]
    $scope.compareCode=[
      {value:"大于",code:5},
      {value:"大于等于",code:6},
      {value:"小于",code:7},
      {value:"小于等于",code:8}
    ]
    $scope.listLoading = true;
    tacticsServer.ruleList({strategyId:$scope.vm.id}).then(function(ret){
      if(ret.data){
        $scope.ruleEdit = true;
        $scope.listLoading = false;
        $scope.ruleList = ret.data.list;
        $scope.stringifyRuleList = JSON.stringify($scope.ruleList);
        var params = {
          applicationCode: $stateParams.applicationCode,
          eventCode: $stateParams.eventCode
        }
        tacticsServer.ruleDict(params).then(function (ret) {
          $scope.calcMethods = ret.data.calcMethods;
          $scope.fieldTypes = ret.data.fieldTypes;
          $scope.fields = ret.data.fields;
          $scope.sheets = ret.data.sheets;
          $scope.operatorSheets = ret.data.operatorSheets;
          $scope.sheetTypes = ret.data.sheetTypes;
          $scope.timeUnits = ret.data.timeUnits;
          $scope.operatorTypes = ret.data.operatorTypes;
        }, function(error) {
        }).finally(function() {
        })
      }else{
        $scope.ruleEdit = false;
      }
      $toaster.success(ret.msg);
    }, function() {
    }).finally(function() {
        $scope.saveloading = false;
    })

    $scope.riskLevel = function(eventCode,patternCode){
      var params = {}
      params.eventCode = eventCode;
      params.patternCode = patternCode;
      if(params.eventCode!=undefined&&params.patternCode!=undefined&&patternCode!=2){
        policyServer.strategyEditLevel(params).then(function(ret){
          if (ret.data && ret.data.maxLevel) {
            $scope.vm.maxLevel = ret.data.maxLevel;
            $scope.attributeConfigList = [];
            for (var i = 0; i <= $scope.vm.maxLevel; i++) {
              $scope.attributeConfigList.push({value:i});
            }
          }
        }, function() {
        }).finally(function() {
        })
      }
    }
    if($scope.vm.patternCode!=2){
      $scope.riskLevel($scope.vm.eventCode,$scope.vm.patternCode);
    }

    //编号开关
    $scope.change = function(id, enable,event){
      var permission = $rootScope.loginAuthData.permissions;
      if(permission.indexOf("rule:disable")<=-1||permission.indexOf("rule:enable")<=-1){
        $toaster.warning("无权限");
        return;
      }
      if(enable){
        tacticsServer.ruleDisable({id:id}).then(function (ret) {
          if(ret.code==0){
            enable = false;
            $toaster.success(ret.msg);
            $state.reload();
          }
        }, function(error) {
        }).finally(function() {
        })
      }else{
        tacticsServer.ruleEnable({id:id}).then(function (ret) {
          if(ret.code==0){
            enable = true;
            $toaster.success(ret.msg);
            $state.reload();
          }
        }, function(error) {
        }).finally(function() {
        })
      }
    }

    $scope.saveNewName = function(item,index) {
      $scope.submitForm(item,index)
    }
    // $scope.$watch("ruleList",function(newVal,oldVal){
    //   console.log("newVal",newVal);
    //   console.log("oldVal",oldVal);
    // })

    $scope.showItem = function(item,index,act){
      var oldItem = $scope.stringifyRuleList ? JSON.parse($scope.stringifyRuleList)[index] : [];
      if(act=="display"){
        if(item.show){
          item.show=false;
          $scope.buttonAdd = false;
        }else{
          item.show=true;
          $scope.buttonAdd = true;
        }
      } else if(act=='up'){
        oldItem.show=true;
        if(JSON.stringify(item) == JSON.stringify(oldItem)){
          $scope.listLoading=true;
          if(item.show){
            item.show=false;
            $scope.buttonAdd = false;
          }else{
            item.show=true;
            $scope.buttonAdd = true;
          }
          $timeout(function(){
            $scope.listLoading=false;
          },250)
        }else{
          $toaster.warning("规则有编辑改动，请先点击保存或取消")
        }
      }else if(act=='cancel'){
        $scope.buttonAdd = false;
        $scope.listLoading=true;
        $scope.ruleList = $scope.stringifyRuleList ? JSON.parse($scope.stringifyRuleList) : [];
        $timeout(function(){
          $scope.listLoading=false;
        },250)
      }
    }
    //点击修改名字
    $scope.modifyItemName = function(index,item,event) {
      item.modifyname = true;
    }
    //增加过滤
    $scope.addFilter = function(item, index){
      item.push({
        factField:"",
        matchField:"",
        matchPattern:""
      });
    };
    //
    $scope.getNewSheetsList = function(itemname,vm){
      var fieldTypeCode;
      angular.forEach($scope.fields,function(vl){
        if(vl.name==itemname) {
          fieldTypeCode = vl.fieldTypeCode;
        }
      })
      if(fieldTypeCode!=undefined){
        angular.forEach($scope.fieldTypes,function(vl1){
          if(vl1.fieldTypeCode==fieldTypeCode) {
            vm.sheetTypes = vl1.matchPatterns;
          }
        })
      }
    }
    //删除过滤
    $scope.deleteFilter = function(item, index){
      if(item.length>0){
        item.splice(index, 1);
      }
    };
    //增加操作
    $scope.addOperate = function(item, index){
      if(item.length<10){
        item.push({
          factField:"",
          matchField:"",
          matchPattern:""
        });
      }else{
        $toaster.info("最多添加10条过滤条件!");
      }
    };
    //删除操作
    $scope.deleteOperate = function(item, index){
      item.splice(index, 1);
    };
    //增加 多条
    $scope.add_defined_many = function(item,springBeanName){
      if(isCanAddNewRule(item,springBeanName)){
        if(item.conditionConfigBean.conditionList==undefined){
          item.conditionConfigBean.conditionList=[{
            conditionList:[
              {
                conditionList:[],
                relation:"0",
                templateConfig:{
                  configData:{
                    factField:"",
                    matchField:"",
                    matchPattern:""
                  },
                  springBeanName:"commonRule",
                  springBeanRule:"many"
                }
              }
            ],
            relation:"",
            templateConfig:{
              springBeanName:"commonRule",
              springBeanRule:"many"
            }
          }]
        }else{
          item.conditionConfigBean.conditionList.push(
            {
              conditionList:[
                {
                  conditionList:[],
                  relation:"0",
                  templateConfig:{
                    configData:{
                      factField:"",
                      matchField:"",
                      matchPattern:""
                    },
                    springBeanName:"commonRule",
                    springBeanRule:"many"
                  }
                }
              ],
              relation:"",
              templateConfig:{
                springBeanName:"commonRule",
                springBeanRule:"many"
              }
            }
          )
        }
      }
    };
    //增加过滤
    $scope.addFilter_many = function(item, index){
      if(item.length<10){
        item.push({
          conditionList:[],
          relation:"0",
          templateConfig:{
            configData:{
              factField:"",
              matchField:"",
              matchPattern:""
            },
            springBeanName:"commonRule",
            springBeanRule:"many"
          }
        });
      }else{
        $toaster.info("最多添加10条过滤条件!");
      }
    };
    //删除 多条
    $scope.deleteFilter_many = function(item, index,outItem,outindex){
      if(item.length>1){
        item.splice(index, 1);
      }else{
        outItem.splice(outindex, 1);
        $scope.manyClick = $scope.manyClick+1;
      }
    };
    //增加 单条
    $scope.add_defined_single = function(item,springBeanName){
      if(isCanAddNewRule(item,springBeanName)){
        if(item.conditionConfigBean.conditionList==undefined){
          item.conditionConfigBean.conditionList=[{
            conditionList:[],
            relation:"0",
            templateConfig:{
              configData:{
                factField:"",
                matchField:"",
                matchPattern:""
              },
              springBeanName:"commonRule",
              springBeanRule:"single"
            }
          }]
        }else{
          item.conditionConfigBean.conditionList.push(
            {
              conditionList:[],
              relation:"0",
              templateConfig:{
                configData:{
                  factField:"",
                  matchField:"",
                  matchPattern:""
                },
                springBeanName:"commonRule",
                springBeanRule:"single"
              }
            }
          )
        }
      }
    };
    //删除 单条
    $scope.deleteFilter_single = function(item, index){
      item.splice(index, 1);
      $scope.singleClick = $scope.singleClick+1;
    };
    //删除
    $scope.delete=function(id){
      tacticsServer.delTactics({id:id}).result.then(function(ret){
          if(ret==true){
          }
      })
      // tacticsServer.ruleDelete({id:id}).then(function (ret) {
      //   if(ret.code==0){
      //     $toaster.success(ret.msg);
      //     $state.reload();
      //   }
      // }, function(error) {
      // }).finally(function() {
      // })
    };
    //请求
    $scope.addTemplet = function(){
      tacticsServer.addList({ruleList:$scope.ruleList}).result.then(function(ret){
        var springBeanName = ret.springBeanName;
        var templateId = ret.templateId;
        var ruleLength = ret.ruleLength;
        $scope.buttonAdd = ret.buttonAdd;
        if(ruleLength==0){
           $scope.ruleList=[{
            templateId:templateId,
            enable:0,
            show:true,
            name:"",
            strategyId:"",
            conditionConfigBean:{
              conditionList:[],
              relation:templateId==3?1:0,
              templateConfig:{
                configData:{
                  conditionsMap:{
                    list:[
                    // {
                    //   factField:"",
                    //   matchField:"",
                    //   matchPattern:""
                    // }
                    ]
                  }
                },
                springBeanName:springBeanName
              }
            },
            operationConfigList:[]
          }]
        }else{
          $scope.ruleList[ruleLength]={
            templateId:templateId,
            show:true,
            name:"",
            strategyId:"",
            conditionConfigBean:{
              conditionList:[],
              relation:templateId==3?1:0,
              templateConfig:{
                configData:{
                  conditionsMap:{
                    list:[]
                  }
                },
                springBeanName:springBeanName
              }
            },
            operationConfigList:[]
          }
        };
        var params = {
          applicationCode: $stateParams.applicationCode,
          eventCode: $stateParams.eventCode
        }
        tacticsServer.ruleDict(params).then(function (ret) {
          $scope.calcMethods = ret.data.calcMethods;
          $scope.fieldTypes = ret.data.fieldTypes;
          $scope.fields = ret.data.fields;
          $scope.sheets = ret.data.sheets;
          $scope.operatorSheets = ret.data.operatorSheets;
          $scope.sheetTypes = ret.data.sheetTypes;
          $scope.timeUnits = ret.data.timeUnits;
          $scope.operatorTypes = ret.data.operatorTypes;
        }, function(error) {
        }).finally(function() {
        })
      })
    }
    $scope.addTemplet2 = function(item,addflag){
      // if(isCanAddNewRule(item)){
        tacticsServer.addList2({item:item,flag:addflag}).result.then(function(ret){
          var springBeanName = ret.springBeanName;
          var templateId = ret.templateId;
          var ruleLength = ret.ruleLength;
          if(item.conditionConfigBean.conditionList.length==0){
             item.conditionConfigBean.conditionList=[{
              conditionList:[],
              relation:"",
              templateConfig:{
                configData:{
                  conditionsMap:{
                    list:[
                    // {
                    //   factField:"",
                    //   matchField:"",
                    //   matchPattern:""
                    // }
                    ]
                  }
                },
                springBeanName:springBeanName,
                springBeanRule:springBeanName
              }
            }]
          }else{
            item.conditionConfigBean.conditionList.push({
              conditionList:[],
              relation:"",
              templateConfig:{
                configData:{
                  conditionsMap:{
                    list:[
                    // {
                    //   factField:"",
                    //   matchField:"",
                    //   matchPattern:""
                    // }
                    ]
                  }
                },
                springBeanName:springBeanName,
                springBeanRule:springBeanName
              }
            })
          };
          var params = {
            applicationCode: $stateParams.applicationCode,
            eventCode: $stateParams.eventCode
          }
          tacticsServer.ruleDict(params).then(function (ret) {
            $scope.calcMethods = ret.data.calcMethods;
            $scope.fieldTypes = ret.data.fieldTypes;
            $scope.fields = ret.data.fields;
            $scope.sheets = ret.data.sheets;
            $scope.sheetTypes = ret.data.sheetTypes;
            $scope.timeUnits = ret.data.timeUnits;
            $scope.operatorTypes = ret.data.operatorTypes;
          }, function(error) {
          }).finally(function() {
          })
        })
      // }

    }
    $scope.getCalcList = function(masterAttr,slaverAttr,attrJson){
      var params={
        masterAttr:masterAttr,
        slaverAttr: slaverAttr||""
      };
      tacticsServer.calc(params).then(function (ret) {
        attrJson.calcMethods = ret.data.list;
      }, function(error) {
      }).finally(function() {
      })
    }
    function isCanAddNewRule(item, springBeanName){
      item = item ? item : [];
      var statisticsRuleClick=0,sheetRuleClick=0,singleClick=0,manyClick=0;
      angular.forEach(item.conditionConfigBean.conditionList,function(data){
        if(data.templateConfig.springBeanRule=="statisticsRule"){
          statisticsRuleClick++;
        }
        if(data.templateConfig.springBeanRule=="sheetRule"){
          sheetRuleClick++;
        }
        if(data.templateConfig.springBeanRule=="single"){
          singleClick++;
        }
        if(data.templateConfig.springBeanRule=="many"){
          manyClick++;
        }
      })
      var allRuleCnt = statisticsRuleClick+sheetRuleClick+singleClick+manyClick;
      if(statisticsRuleClick>2&&springBeanName=='statisticsRule') {
        $toaster.info("最多添加3个统计规则!");
        return false;
      } else if(sheetRuleClick>2&&springBeanName=='sheetRule') {
        $toaster.info("最多添加3个名单规则!");
        return false;
      } else if(singleClick>2&&springBeanName=='single') {
        $toaster.info("最多添加3条单条件!");
        return false;
      } else if(manyClick>2&&springBeanName=='many') {
        $toaster.info("最多添加3条多条件!");
        return false;
      } else if(allRuleCnt>=10){
        $toaster.info("最多添加10条过滤条件!");
        return false;
      } else {
        return true;
      }
    }
    $scope.submitForm = function(item,index){
      if(angular.element(document).find("#ruleList").find(".valid").valid()){
        var params = item;
        params.strategyId = $stateParams.id;
        if(item.conditionConfigBean&&item.conditionConfigBean.relation!=undefined){
          params.conditionConfigBean.relation = item.conditionConfigBean.relation;
        }else{
          params.conditionConfigBean.relation = "0";
        }
        if(item.templateId==3){
          if(item.conditionConfigBean.conditionList.length==0) {
            $toaster.warning("执行条件不能为空，请添加条件！");
            return;
          }
        }
        if(item.id!=undefined){
          tacticsServer.ruleModify(params).then(function(ret){
            $toaster.success(ret.msg);
            $state.reload();
          }, function() {
          }).finally(function() {
            $scope.saveloading = false;
          })
        }else{
          tacticsServer.ruleAdd(params).then(function(ret){
            $toaster.success(ret.msg);
            $state.reload();
          }, function() {
          }).finally(function() {
            $scope.saveloading = false;
          })
        }

      }
    }
    /*规则管理拖拽排序*/
    $scope.sortableOptions = {
      stop:function(event,ui){
        var sortingArr = [];
        angular.forEach(ui.item.sortable.sourceModel,function(item,index){
            var sortingObj = {}
            sortingObj.id=item.id
            sortingObj.position=index+1
          sortingArr.push(sortingObj);
        })
        var params ={}
        params.requestList =sortingArr
        tacticsServer.tacticSort(params).then(function(ret){
            if(ret.code == 0){
              $state.reload()
        }
        },function(ret){
          //do something
        }).finally(function() {
          //do something
        })
      }
    }
  }
  angular.module('ngTicket').controller('addTempletCtrl', addTempletCtrl);
  /* @ngInject */
  function addTempletCtrl($scope,$modalInstance, $state, $stateParams, $config, tableHelp, policyServer, tacticsServer, $timeout, $toaster,listServer, data) {
    //添加模板
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    tacticsServer.templateList().then(function (ret) {
      $scope.templateList = ret.data.list;
    }, function(error) {
    }).finally(function() {
    })
    $scope.ruleList=data.ruleList;
    if($scope.ruleList){
      var ruleLength = $scope.ruleList.length;
    }else{
      var ruleLength = 0;
    }
    $scope.addTem = function(springBeanName, templateId){
      if(data.flag=='inaddtmp'){
        if(isCanAddNewRule(data.item,springBeanName)){
          addTmpFun(springBeanName, templateId);
        }
      } else {
        addTmpFun(springBeanName, templateId);
      }
    }
    function addTmpFun(springBeanName, templateId){
      if(springBeanName=="statisticsRule"){
        $scope.dataList={
          springBeanName:springBeanName,
          templateId:templateId,
          ruleLength:ruleLength,
          buttonAdd:true
        };
        $modalInstance.close($scope.dataList);
      }else if(springBeanName=="sheetRule"){
        $scope.dataList={
          springBeanName:springBeanName,
          templateId:templateId,
          ruleLength:ruleLength,
          buttonAdd:true
        };
        $modalInstance.close($scope.dataList);
      }else if(springBeanName=="commonRule"){
        $scope.dataList={
          springBeanName:springBeanName,
          templateId:templateId,
          ruleLength:ruleLength,
          buttonAdd:true
        };
        $modalInstance.close($scope.dataList);
      }
    }
    function isCanAddNewRule(item, springBeanName){
      item = item ? item : [];
      var statisticsRuleClick=0,sheetRuleClick=0,singleClick=0,manyClick=0;
      angular.forEach(item.conditionConfigBean.conditionList,function(data){
        if(data.templateConfig.springBeanRule=="statisticsRule"){
          statisticsRuleClick++;
        }
        if(data.templateConfig.springBeanRule=="sheetRule"){
          sheetRuleClick++;
        }
        if(data.templateConfig.springBeanRule=="single"){
          singleClick++;
        }
        if(data.templateConfig.springBeanRule=="many"){
          manyClick++;
        }
      })
      var allRuleCnt = statisticsRuleClick+sheetRuleClick+singleClick+manyClick;
      if(statisticsRuleClick>2&&springBeanName=='statisticsRule') {
        $toaster.info("最多添加3个统计规则!");
        return false;
      } else if(sheetRuleClick>2&&springBeanName=='sheetRule') {
        $toaster.info("最多添加3个名单规则!");
        return false;
      } else if(singleClick>2&&springBeanName=='single') {
        $toaster.info("最多添加3条单条件!");
        return false;
      } else if(manyClick>2&&springBeanName=='many') {
        $toaster.info("最多添加3条多条件!");
        return false;
      } else if(allRuleCnt>=10){
        $toaster.info("最多添加10条过滤条件!");
        return false;
      } else {
        return true;
      }
    }
  }
})();

angular.module('ngTicket').controller('delTacticsCtrl', delTacticsCtrl);
  /* @ngInject */
  function delTacticsCtrl($scope, $state, $stateParams, $config, tableHelp, listServer, tacticsServer, $timeout, $toaster, $modalInstance, $locale,data) {
    // 删除规则
    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.vm = {}
    $scope.eventformvalidate = {
      submitHandler: function () {
        var params = {
          id:data.id
        };
        tacticsServer.ruleDelete(params).then(function (ret) {
          if(ret.code==0){
            $toaster.success(ret.msg);
            $state.reload();
            $modalInstance.close();
          }
        }, function(error) {
        }).finally(function() {
        })
      }
    }
  }

angular.module('ngTicket')
.directive('modifyRuleName', ['$document', '$window',"$timeout","$toaster", function($document, $window,$timeout,$toaster) {
    return {
        restrict: 'AC',
        scope: {
          oldInfo:'=?',
          blurFun:"&?"
        },
        templateUrl: '/app/ruleEngine/tactics/modifyname.tmp.html',
        link: function(scope, el, attr) {
            var prevName = scope.oldInfo.name;
            el.on("click",".item-name",function(){
              $(this).addClass("hide");
              $(this).next().removeClass("hide").focus();
            })
            el.find(".focus-input").blur(function(){
              el.find(".item-name").removeClass("hide");
              el.find(".item-name").next().addClass("hide");
              if( scope.oldInfo.name!=prevName ){
                scope.blurFun(scope.oldInfo);
              } else {
                $toaster.warning("规则名称未改变")
              }
            })

        }
    };
}]);
