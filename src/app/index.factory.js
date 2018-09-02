'use strict';

angular.module('ngTicket')
    .factory('RootRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('');
        });
    })
    .factory('CorsRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('http://127.0.0.1:1339');
        });
    }).factory('RestFulResponse', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });
    }).factory('ticketSocket', function(socketFactory,$config,$rootScope) {
        return socketFactory({
            ioSocket: io.connect(window.env.socket,{query:'token={0}'.format($rootScope.locals.access_token)})//, {path: "/ticket_sync/socket.io"}
        });
    })
    /*
    * @ngdoc service
    * @name global.service:$toaster
    * @requires toaster
    *
    * @description
    *  method success,error,info,wait,warning,clear
    *
    * @example
      <example module="rfx">
          <file name="demo.js">
         $toaster.success("删除成功")
     </file>

      </example>
    */

.factory('$toaster', ['toaster', function(toaster) {
        return {
            success: function(text, timeout, bodyOutputType, clickHandler) {
                toaster.pop('success', "", text, timeout, bodyOutputType, clickHandler);
            },
            error: function(text, timeout, bodyOutputType, clickHandler) {
                toaster.pop('error', "", text, timeout || 3000, bodyOutputType, clickHandler);
            },
            info: function(text, timeout, bodyOutputType, clickHandler) {
                toaster.pop('info', "", text, timeout || 3000, bodyOutputType, clickHandler);
            },
            wait: function(text, timeout, bodyOutputType, clickHandler) {
                toaster.pop('wait', "", text, timeout, bodyOutputType, clickHandler);
            },
            warning: function(text, timeout, bodyOutputType, clickHandler) {
                toaster.pop('warning', "", text, timeout || 3000, bodyOutputType, clickHandler);
            },
            ticket: function(text,clickHandler1) {
                toaster.pop({
                    type: 'info',
                    timeout: 0,
                    body: text,
                    bodyOutputType: "trustedHtml",
                    clickHandler1:clickHandler1,
                    options: {
                        "closeButton": true,
                        "position": "toast-top-right"
                    }
                });
            },
            clear: function() {
                toaster.clear();
            }
        };
    }]).factory('$messages', [function() {
        return {
            init: function(title, text, clickHandler) {
                Push.create(title, {
                    body: text,
                    icon: {
                        x16: '../../../assets/images/favicon.ico',
                        x32: '../../../assets/images/favicon.ico'
                    },
                    requireInteraction:true,
                    tag: new Date().getTime() + generateMixed(1),
                    onClick: function(event) {
                        clickHandler();
                        event.currentTarget.close();
                        window.focus();
                    }
                });
            }
        };
    }])
    .factory('$dialogs', ['dialogs', function(dialogs) {
        return {
            alert: function(msg, op, title) {
                return dialogs.notify(title || null, msg, op);
            },
            confirm: function(msg, op, title) {
                var ops = angular.extend({}, {
                    'size': 'sm'
                }, op);
                return dialogs.confirm(title || null, msg, ops);
            },
            wait: function(msg, progress, op, title) {
                var ops = angular.extend({}, {
                    'backdrop': 'static',
                    'keyboard': false
                }, op);
                return dialogs.wait(title || null, msg, progress, ops);
            },
            create: function(url, ctrlr, data, opts) {
                return dialogs.create(url, ctrlr, data, opts);
            }
        }
    }])
    .factory('httpErrorFilters', [function() {
        return function(response, callback) {

            response.status == 200 && callback(response);
        };
    }]).factory('tableHelp', ['$timeout', '$httpApi', 'ngTableParams', '$location', '$toaster', '$locale', function($timeout, $httpApi, ngTableParams, $location, $toaster, $locale) {

        return function($scope, options, hook) {

            var defaults = {
                page: 1,
                pageSize: 20

            }
            options = angular.extend({}, defaults, options);


            return {

                remove: function(id, e) {
                    id && (function() {

                    })()
                },
                tableParams: function(url, params2) {


                    return new ngTableParams(angular.extend({
                            page: options.page,
                            count: options.pageSize
                        },
                        $location.search()), {
                        total: 0,
                        filterDelay: 0,
                        getData: function($defer, params) {
                            if (!options.noParams) {
                                $location.search(params.url()); // put params in url
                            };

                            var params1 = {
                                currentPage: params.page(),
                                pageSize: options.pageSize
                            };

                            var params3 = angular.extend({}, params1, angular.isFunction(params2) ? params2() : params2);
                            $httpApi.post(url, params3).then(function(result) {
                                if(result.data==null||result.data==""){
                                    result.data={list: [], page: {total: "0", page_size: 20, total_page: 0}};
                                }else{
                                    hook && hook(result.data);
                                    if (angular.isDefined(result.data.page)) {
                                        if (angular.isDefined(result.data.page.total)) {
                                            params.total(result.data.page.total);
                                        } else {
                                            params.total(result.data.list.length);
                                        }

                                    } else {
                                        if (angular.isDefined(result.data.recordCount)) {
                                            params.total(result.data.recordCount);
                                        } else {
                                            if (angular.isDefined(result.data.recordCount)) {
                                                params.total(result.data.recordCount);
                                            }else{
                                                 // var number = result.data.length >= 0 ? result.data.length : result.data.rows.length;
                                                 params.total(result.data.recordCount);
                                            }
                                           
                                        }

                                    }
                                }
                                
                                $defer.resolve(result.data.rows || result.data.datalist || result.data.datalists || result.data.list || result.data);

                            }, function() {
                                $toaster.info($locale.FORMTIPS.dataError)
                                $defer.resolve([]);
                            })


                        }
                    })
                }

            }

        };
    }]).factory('$httpApi', ["$http", "$filter", "$q", "$config", "$dialogs", '$rootScope', '$injector', '$toaster', function($http, $filter, $q, $config, $dialogs, $rootScope, $injector, $toaster) {

        var transform = function(data) {
            var data2 = {};
            //data2._wid_ = userData.wid; 每次提交增加字段
            data = angular.extend({}, data2, data);
            return JSON.stringify(data);
        };
        var commond = {
            transformRequest: transform,
            headers: {
                'Content-Type': "application/json;charset=utf-8"
            }

        };
        var responseHandle = function(response, deferred, config) {
            if ((response.data.code == 0)) {
    
                return deferred.resolve(config.fullResponse ? response : response.data);
            } else {
                //登录超时
                if (response.data.code == "1" || response.data.code == "1041" || response.data.code == "899001") {
                    var authService = $injector.get('authService');
                    // $toaster.warning("登录失效 请重新登录");
                    // authService.logout();
                    // window.postFlag = true;

                };
                if ($config.debug) {
                    $dialogs.alert(response.data.msg || response.data)
                } else {
                    // $toaster.info(response.data.msg || "网络异常 请重试 !");
                }
                return deferred.reject(response);
            }
        }

        return {
            post: function(url, data, config) {
                var deferred = $q.defer();
                config = angular.extend({}, commond, config);
                if (!window.postFlag) {
                    $http.post($filter('apiUrlPrefix')(url), data, config).then(function(response) {
                        responseHandle(response, deferred, config);
                    }, function(response) {
                        return deferred.reject(response);
                    });
                } else {
                    console.log("postFlag....")
                }

                return deferred.promise;
            },
            get: function(url, data, config) {
                var deferred = $q.defer();
                config = angular.extend({}, commond, config);
                if (!window.postFlag) {
                    $http.get($filter('apiUrlPrefix')(url), {
                        params: data
                    }, config).then(function(response) {
                        responseHandle(response, deferred, config)
                    }, function(response) {
                        return deferred.reject(response);
                    });
                } else {
                    console.log("postFlag....")
                }
                return deferred.promise;
            }

        };
    }]).factory('authInterceptorService', ['$q', 'ipCookie', '$toaster', '$injector', '$config', function($q, ipCookie, $toaster, $injector, $config) {

        var authInterceptorServiceFactory = {};

        var _request = function(config) {
            config.headers = config.headers || {};
            var access_token = ipCookie(window.env.cookieName);
            if (access_token) {

                config.headers.Authorization ="Bearer "+access_token;
                config.headers.Apiclient = 'testing-tools';
                // config.headers.Referer="http://www.hd3p.com"


            }
            return config;
        }

        var _responseError = function(rejection) {
            var errorTips = function() {
                if ($config.debug) {
                    var $dialogs = $injector.get('$dialogs');
                    $dialogs.alert(rejection.data.message || rejection.data)
                } else {
                    $toaster.info("网络异常 请重试 !");
                }
            }
            if (rejection.status != 200) {
                errorTips();
            };

            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }]).factory('authService', ['$q', 'Restangular', 'ipCookie', '$config', '$locale', '$httpApi', '$state', '$timeout', '$rootScope',
        function($q, Restangular, ipCookie, $config, $locale, $httpApi, $state, $timeout, $rootScope) {


            var authServiceFactory = {};
            var defaultfauthentication = {
                isAuth: false,
                token: null,
                userData: null
            };
            var params = {
                path: '/',
                expires: false
            };
            var _authentication = defaultfauthentication;

            var _logout = function() {
                // $httpApi.post($config.api3.user.logout, {}).then(function(result) {
                //     ipCookie.remove(window.env.cookieName);

                // }, function() {
                //     ipCookie.remove(window.env.cookieName);
                // });
                ipCookie.remove(window.env.cookieName);
                _authentication.isAuth = false;
                _authentication.data = null;
                $state.go('access.signin',{},{reload: true});
                // $state.go("app.dashboard")
            };
            var _logtimeout = function() {
                // $httpApi.post($config.api3.user.logout, {}).then(function(result) {
                //     ipCookie.remove('authorizationData', params);

                // }, function() {
                //     ipCookie.remove('authorizationData', params);
                // });
                ipCookie.remove(window.env.cookieName);
                _authentication.isAuth = false;
                _authentication.data = null;
                $state.go('access.signin',{},{reload: true});
                // $state.go("app.dashboard")
            };
            var _saveRegistration = function(registration) {
                _logout();
                return Restangular.one('auth/register').customPOST(registration).then(function(response) {
                    setData(response);
                    return response;
                });

            };
            var setData = function(response) {

                _authentication.isAuth = true;
                _authentication.data = response.data;
                _authentication.userData = response.data;
               /* _authentication.userData = _authentication.data.user;
                _authentication.groups = _authentication.data.groups;
                _authentication.group_list = _authentication.data.group_list;*/
                _authentication.isAuth = true;
                _authentication.access_token = _authentication.data.accessToken;
                /*if (response.data.user.role == 3) {
                    _authentication.userRole = {
                        ticket_feedback: 2,
                        ticket_del: 1,
                        ticket_edit: 1,
                        user_edit: 1,
                        autofeed_edit: 1,
                        ticket_solve:1,
                        read_report: 1,
                        agent_query:1,
                        content_edit:1,
                        modify_order:1,
                        business_edit:1,
                        yuequan:1,
                        see_tool:1
                    }
                } else {
                    _authentication.userRole = _authentication.data.agent_role;
                }*/
                //app 获取用户的数据后才显示页面
                $rootScope.userData_done = true;

            }
            var _login = function(loginData) {

                var deferred = $q.defer();
                //记住密码
                if (loginData.remember) {
                    params["expires"] = 365;

                } else {
                    params["expires"] = false;
                }

                $httpApi.post($config.api3.user.login, loginData).then(function(response) {
                    ipCookie(window.env.cookieName, response.data.accessToken, params);
                    setData(response);
                    deferred.resolve(response);

                }, function(err) {
                    // _logOut();
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            var _remove = function() {
                ipCookie.remove(window.env.cookieName);
                _authentication.isAuth = false;
                _authentication.data = null;
                $state.go('access.signin');
                // $state.go("app.dashboard")
            };

            var _fillAuthData = function() {
                var access_token = ipCookie(window.env.cookieName);
                if (access_token) {
                    $httpApi.post($config.api3.user.info, {}).then(function(response) {
                        $rootScope.loginAuthData = {}
                        $rootScope.loginAuthData.applications = response.data.applications;
                        $rootScope.loginAuthData.permissions = response.data.permissions;
                        $rootScope.loginAuthData.roles = response.data.roles;
                    },function(err) {
                        ipCookie.remove(window.env.cookieName);
                    }).then(function() {

                    })
                    _authentication.isAuth = true;
                }
                return _authentication;
            }


            authServiceFactory.saveRegistration = _saveRegistration;
            authServiceFactory.login = _login;
            authServiceFactory.logout = _logout;
            authServiceFactory.fillAuthData = _fillAuthData;
            authServiceFactory.removeAuthData = _remove;

            return authServiceFactory;
        }
    ]).factory('formatTimefun', ['$locale', function($locale) {
        return function(seconds) {
            var re = '',
                q = 0,
                o = seconds > 0 ? Math.round(+seconds) : Math.floor(Date.now() / 1000),
                TIME = $locale.DATETIME;

            function calculate(base) {
                q = o % base;
                o = (o - q) / base;
                return o;
            }
            calculate(60);
            re = q + TIME.second;
            calculate(60);
            re = (q > 0 ? (q + TIME.minute) : '') + re;
            calculate(24);
            re = (q > 0 ? (q + TIME.hour) : '') + re;
            return o > 0 ? (o + TIME.day + re) : re;
        };
    }]).factory('$state2', ['$state', '$stateParams', '$window', function($state, $stateParams, $window) {
        return {
            current: function() {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true
                });
                // $state.transitionTo($state.current, $stateParams, {
                //     reload: true,
                //     inherit: false,
                //     notify: true
                // });;
            },
            back: function() {
                $window.history.back();
            }
        };
    }]).factory('$tableids', function() {
        return function(item) {
            var id = null;
            if (angular.isArray(item)) {
                id = item.map(function(zitem) {
                    return zitem.id;
                }).join(',')
            } else {
                id = item.id;
            }
            return id;
        };
    })
