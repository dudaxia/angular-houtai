/*
 * @Author: hui.wang 
 * @Date: 2017-10-16 10:35:53 
 * @Last Modified by: hui.wang
 * @Last Modified time: 2017-10-24 11:09:19
 */

;
(function() {
    'use strict';
    angular.module('ngTicket')
    .controller('subsideMenuCtrl', ['$scope', '$toaster', '$config', '$locale',  '$state',  '$rootScope', 'ipCookie', '$timeout','$stateParams',
        function($scope, $toaster, $config, $locale, $state, $rootScope, ipCookie, $timeout,$stateParams) {


            angular.forEach($rootScope.subMenu,function(item,index){
                if($scope.hasCenter&&index==0){
                  item.firstIconUrl="/assets/images/center.png";
                  item.secIconUrl="/assets/images/center_hover.png";                 
                }
                
                item.showPic=item.firstIconUrl;
            });
            
            var queryurl = decodeURIComponent($stateParams.queryurl);
            var isFirst = true;
            
            // 为修复在切换到【微盟套餐】页面时，第一级菜单不展开
            var isInited = false;
            
            init();
            function init(){
                isUrlExist(queryurl);
                if( $scope.outParams.menu&&$scope.outParams.menu.id ){
                    var key=$scope.outParams.menu.id;  // id
                    var item=$scope.outParams.menu;  //menu
                } else {
                    var key=getIndex($rootScope.subMenu);  // id
                    var item=$rootScope.subMenu[0];  //menu
                }
                initCurrentMenu(key,item); 
            };

            function isUrlExist(inqueryurl) {
                $scope.outParams={};
                angular.forEach($rootScope.subMenu,function(item1){
                    if(item1.url==inqueryurl){
                        $scope.outParams.url = item1.url;
                        $scope.outParams.menu = item1;
                        $scope.outParams.menuChild = item1;
                        return $scope.outParams;
                    }
                    if(item1.child&&item1.child.length>0){
                        angular.forEach(item1.child,function(item2){
                            if(item2.url==inqueryurl){
                                $scope.outParams.url = item2.url;
                                $scope.outParams.menu = item1;
                                $scope.outParams.menuChild = item2;
                                return $scope.outParams;
                            }
                            if(item2.child&&item2.child.length>0){
                               angular.forEach(item2.child,function(item3){
                                    if(item3.url==inqueryurl){
                                        $scope.outParams.url = item3.url;
                                        $scope.outParams.menu = item1;
                                        $scope.outParams.menuChild = item3;
                                        return $scope.outParams;
                                    } else {
                                        return false;
                                    }
                                }); 
                            } else {
                               return false;
                            }
                        });
                    } else {
                        return false;
                    }
                })
            }

            function initCurrentMenu(key,item){
                if(changeCurrentMenu(key,item)){
                    changeSubmenu(item);
                }
                isInited = true;
            }

            function changeSubmenu(menu) {           
                if(menu.child.length>0){
                    if( $scope.outParams.menu&&$scope.outParams.menu.id ){
                        angular.forEach(menu.child,function(val){
                            if(val.id==$scope.outParams.menuChild.id){
                                getChildMenu(val.id,val,true); 
                            }
                            if(val.child&&val.child.length>0){
                                angular.forEach(val.child,function(val2){
                                    if(val2.id==$scope.outParams.menuChild.id){
                                        getChildMenu(val.id,val,true); 
                                    }
                                })
                            }
                        })             
                    }else {
                        getChildMenu(getIndex(menu.child),menu.child[0]); 
                    }
                } else { 
                    // getChildMenu(getIndex(menu.child),menu.child[0]);
                    getUrl(menu.url,menu);
                }  
            }

            $scope.menuWatch = $scope.$watch('currentMenu.isQuestionClick', function (newVal, oldVal) {
              if (newVal != oldVal && newVal) {
                var currentMenu = $rootScope.subMenu[$scope.currentMenu.firstMenuKey].child[$scope.currentMenu.secMenuKey];
                angular.forEach($rootScope.subMenu,function(item){
                  if($scope.currentMenu.firstMenu!=item.id){
                      item.showPic=item.firstIconUrl;
                  }                 
              })    
                $scope.currentMenu.isQuestionClick = false;  
                $scope.onClickItem(currentMenu.id, currentMenu);
              };
            });

            //取消监听
            $scope.$on('$destroy', function () {
              if ($scope.menuWatch) {
                $scope.menuWatch();
                $scope.menuWatch = null;
              }
            })

            // 监听来自父控制器的菜单事件变换
            $scope.$on('horizontal_menu_item_clicked',function(event, menu){
                var key = menu.id;
                var item = menu;
                $scope.currentMenuId = key;
                $scope.onClickItem(key, item);
            });

            $scope.onClickItem = function(key, item){
                //点击菜单，     
                // initCurrentMenu(key,item);
                isFirst = false;
                if(item.level==1){
                    // 此代码段注释，转为下方的 menuSeclected 事件进行广播
                    // if(item.name=="新云"){
                    //     $rootScope.$broadcast('isPackage', "xinyun", item);
                    // } else if(item.name=="老云") {
                    //     $rootScope.$broadcast('isPackage', "laoyun", item);
                    // }
                    if( item.child&&item.child.length>0 ){
                        initCurrentMenu(key,item);
                    } else {
                        changeCurrentMenu(key,item);
                        getUrl(item.url);
                    }
                } else if(item.level==2) {
                    if( item.child&&item.child.length>0 ){
                        getChildMenu(key,item);
                    } else {
                        changeCurrentMenu(key,item);
                        getUrl(item.url);
                    }
                } else if( item.level==3 ){
                    changeCurrentMenu(key,item);          
                    getUrl(item.url);
                }

            }; 

            function getUrl(contentUrl){
                // $scope.contentUrl=url;
                if($scope.hasCenter&&$scope.currentMenu.firstMenu==$rootScope.subMenu[0].id){
                    $scope.isCenter=true;
                } else {
                    $scope.isCenter=false;
                }
                // $scope.getContentDetail({url:$scope.contentUrl,isCenter:$scope.isCenter});
                $scope.getContentDetail({url:contentUrl,isCenter:$scope.isCenter});      
     
            }

            function getChildMenu(key,menu,isDir){   
                if(!isDir&&(menu.level==1||menu.level==2)){
                    if(isFirst&&menu.child&&menu.child.length>0){
                        changeCurrentMenu(key,menu); 
                        changeSubmenu(menu);
                    }else {
                       changeCurrentMenu(key,menu);  
                    }
                } else {
                    if(isFirst){
                        changeCurrentMenu(key,menu); 
                    } 
                    changeSubmenu(menu);
                }  
                if(isDir&&(menu.level==3)){
                    changeCurrentMenu(key,menu,isDir); 
                    changeSubmenu(menu);
                }       
            };

            function changeCurrentMenu(key,menu,isDir){
                var isOpen=true;
                 switch(Number(menu.level)){
                    case 1:{
                        if($scope.currentMenu.firstMenu==key){
                           $scope.currentMenu.firstOpened =! $scope.currentMenu.firstOpened;
                           if(!isInited){
                             $scope.currentMenu.firstOpened = true
                             menu.showPic=menu.secIconUrl;
                           }
                           isOpen=false;
                        } else {
                            $scope.currentMenu.firstOpened=true;
                            isOpen=true;
                            $scope.currentMenu.firstMenu=key;
                            $scope.currentMenu.firstMenuName=menu.name;
                            $scope.currentMenu.secMenu=null;
                            $scope.currentMenu.thirdMenu=null;
                            $scope.currentMenu.secMenuName='';
                            $scope.currentMenu.thirdMenuName=''; 
                            menu.showPic=menu.secIconUrl;
                            angular.forEach($rootScope.subMenu,function(item){
                                if($scope.currentMenu.firstMenu!=item.id){
                                    item.showPic=item.firstIconUrl;
                                }
                            })                           
                        }  
                        break;                     
                    }
                    case 2:{
                        if($scope.currentMenu.secMenu==key){
                            $scope.currentMenu.secOpened=!$scope.currentMenu.secOpened;
                            isOpen=false;
                        } else{
                            $scope.currentMenu.secOpened=true;
                            isOpen=true;
                            $scope.currentMenu.secMenu=key;
                            if( menu.child&&menu.child.length<=0 ){
                                // $scope.currentMenu.thirdMenu=null;
                                $scope.currentMenu.thirdMenuName='';  
                                $scope.currentMenu.secMenuName=menu.name;
                            } else {
                                $scope.secMenuName=menu.name;
                                $scope.currentMenu.secMenuName=$scope.currentMenu.secMenuName?$scope.currentMenu.secMenuName:menu.name;
                            }
                        }
                        break;                      
                    }
                    case 3:{
                        if($scope.currentMenu.thirdMenu==key){                         
                            isOpen=false;
                        } else {                           
                            isOpen=true;
                            $scope.currentMenu.thirdMenu=key;
                            $scope.currentMenu.thirdMenuName=menu.name;

                            $scope.currentMenu.secMenuName=$scope.secMenuName;

                            if( isDir ) {
                                $scope.currentMenu.secOpened=true;
                            }
                        }
                       
                        break;
                    }
                    default:$scope.currentMenu.firstMenu=key; 
                        $scope.currentMenu.secMenu=null;
                        $scope.currentMenu.thirdMenu=null;
                }
                // 发出菜单项更新完毕事件
                $rootScope.$broadcast('menuSeclected', menu, $scope.currentMenu)
                return isOpen;
            };
            
            function getIndex(item){ 
                  if(item && item[0] &&  item[0].id){
                    return item[0].id
                  }               
            };
        }
    ]);
})();
