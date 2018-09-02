'use strict';

angular.module('ngTicket')
    .controller('signupCtrl', ['$scope', '$filter', 'httpErrorFilters', '$state', 'authService','$toaster',
        function($scope, $filter, httpErrorFilters, $state, authService,$toaster) {
            $rootScope.loginPage = true;
            $scope.$on("$destroy", function() {
                $rootScope.loginPage = false;
            })

            $scope.signup = function() {
                $scope.signuploading = true;
                authService.saveRegistration($scope.entity).then(function(response) {
                           $state.go('app.dashboard');
                    },
                    function(err) {
                         httpErrorFilters(err,function  () {
                            $toaster.info("用户名重复 或其他错误。。。");
                        })
                   
                    }).then(function() {
                    $scope.signuploading = false;
                })
            };
        }
    ]);
