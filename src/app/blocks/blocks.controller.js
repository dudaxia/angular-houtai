/*'use strict';*/

angular.module('ngTicket').controller('blocksCtrl', ['$rootScope','$scope', '$toaster', '$config', '$locale', 'authService','$state','$messages',"ipCookie","$http","topheaderServer","$httpApi",
    function($rootScope,$scope, $toaster, $config, $locale, authService,$state,$messages,ipCookie,$http,topheaderServer,$httpApi) {
        /*if(!ticketSocket){

        }*/
        $scope.addUser = function() {
          
        }
       
        $scope.logout = function() {
            // authService.logout();
            $httpApi.post($config.api3.user.logout, {}).then(function(result) {
                ipCookie.remove(window.env.cookieName);
                $state.go('access.signin',{},{reload: true});
            }, function() {
                ipCookie.remove(window.env.cookieName);
            });
        }
        $scope.changePassword = function(userId) {
            
        };

        // $http({
        //     url:'/api3/dict/applicaiton/list',
        //     method: 'POST'
        // }).success(function(ret){
        //     $scope.list = ret.data.list;
        // }).error(function(ret){
        //     $toaster.info(ret.msg);
        // })
        // topheaderServer.dictApplicaitonList().then(function (ret) {
        //   $scope.list = ret.data.list;
        // }, function(error) {
        // }).finally(function() {
        // })
        $scope.change = function(applicationCode){
            $rootScope.applicationCode=applicationCode;
            $rootScope.$broadcast('reload');
        }
       
    }
]).factory('topheaderServer', topheaderServer)
    function topheaderServer($httpApi, $config, $dialogs) {
      var api = $config.apiList;

      return {
        dictApplicaitonList: function(item) {
          return $httpApi.post($config.apiList.dictApplicaitonList, item);
        },
        
      };
     
    };