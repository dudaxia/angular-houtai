'use strict';

angular.module('ngTicket').factory('accessServer', ['$httpApi', '$config', '$q', '$dialogs', function($httpApi, $config, $q, $dialogs) {
    return {
      restPasswordDialog: function(item) {
        return $dialogs.create('/app/access/reset.password.model.html', 'restPasswordDialogCtrl', item);
      },
      sendCode: function(item) {
        return $httpApi.post($config.api2.account.sendCode, item);
      },
      resetPassword: function(item) {
        return $httpApi.post($config.api2.account.resetPassword, item);
      }
    };
  }])
  .controller('signinCtrl', ['$scope', '$config', '$httpApi', '$rootScope', '$state', '$toaster', 'authService', 'accessServer','ipCookie',
    function($scope, $config, $httpApi, $rootScope, $state, $toaster, authService, accessServer,ipCookie) {
      window.postFlag = false;
      $scope.$on("$destroy", function() {
        $rootScope.loginPage = false;
      })
      if(window.ipcRenderer){
        $scope.electron=true;
      }
      $scope.restPassword = function() {
        // accessServer.restPasswordDialog({
        //   mobile: angular.isDefined($scope.loginData) ? $scope.loginData.mobile : ""
        // }).result.then(function(data) {
        //   console.log(data);
        // });
      }
      $scope.psdisabled = false;
      $scope.eventformvalidate = {
        submitHandler: function() {
          $scope.$apply(function() {
            $scope.loginloading = true;
            var loginData = {
              username: $("#email").val(),
              password: $("#password").val()
              // remember: $scope.loginData.remember
            }
             // if (!$scope.embed_captcha_data) {
             //        $scope.loginloading = false;
             //   return   $toaster.info("请滑动完成验证 !");
             // }
            // var formData = angular.extend({}, loginData);
            // authService.login(formData).then(function(response) {
            //   ipCookie(window.env.cookieName,"already_login");
            //     if ($rootScope.previousState_name) {
            //       $state.go($rootScope.previousState_name, $rootScope.previousState_params);
            //     } else {
            //       $state.go('app.dashboard');
            //     }
            //   },
            //   function(err) {
                
            //   }).then(function() {
            //   $scope.loginloading = false;
            // })
            $toaster.success("登录成功")
            $state.go('app.dashboard');
          })

        }
      }
    }
  ]).controller('restPasswordDialogCtrl', ['$scope', '$toaster', '$locale', 'accessServer', 'data', '$modalInstance', '$httpApi', '$config', '$interval', function($scope, $toaster, $locale, accessServer, data, $modalInstance, $httpApi, $config, $interval) {


    $scope.cancel = function() {
      $modalInstance.dismiss('Canceled');
    };
    $scope.entity = {};
    $scope.entity.mobile = data.mobile;

    $scope.sendCode = function() {
      $scope.psdisabled = true;
      var sendcode2 = function() {
        var second = 60;
        var timer = $interval(function() {
          second -= 1;;
          $scope.btnText = "{0}秒后重新获取".format(second);
          if (second < 1) {
            $interval.cancel(timer);
            $scope.psdisabled = false;
            $scope.btnText = "重新获取";
          };

        }, 1000);
        $scope.btnText = "60秒后重新获取";
      }


      accessServer.sendCode({
        mobile: $scope.entity.mobile
      }).then(function() {
        sendcode2();
      }, function() {
        $toaster.success($locale.FORMTIPS.messageError);
      });

    };
    $scope.btnText = "获取验证码";

    $scope.psdisabled = true;
    $scope.$watch("entity.mobile", function(mobile) {
      if (mobile) {
        if (mobile.length == 11) {
          $httpApi.post($config.api2.account.checkMobile, {
            "mobile": mobile,
            "is_send": 0
          }).then(function(result) {

            if (angular.isDefined(result.data.password)) {
              $scope.psdisabled = false;
              $scope.accountData = result.data;

            } else {
              $toaster.info("没有找到该用户");
            }

          });
        }
      };


    });
    $scope.eventformvalidate = {
      submitHandler: function() {
        $scope.$apply(function() {
          $scope.saveloading = true;
          accessServer.resetPassword($scope.entity).then(function() {
            $toaster.success($locale.FORMTIPS.modifySuccess);
            $modalInstance.close($scope.entity.mobile);
            $scope.saveloading = false;
          }, function(error) {
            $toaster.info(error.message);
            $modalInstance.close($scope.entity.mobile);
          });

        })

      }
    }

  }]);
