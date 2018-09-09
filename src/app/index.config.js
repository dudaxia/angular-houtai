'use strict';

angular.module('ngTicket')
    .config(['RestangularProvider', '$httpProvider', '$config', '$pageTitleProvider', 'dialogsProvider', '$translateProvider', function(RestangularProvider, $httpProvider, $config, $pageTitleProvider, dialogsProvider, $translateProvider) {

        RestangularProvider.setBaseUrl($config.host.api);

        // $sailsProvider.url = 'http://sbgo.cc:8066';
        // $httpProvider.url = 'http://sbgo.cc:8066';

        (function() { //授权配置&&和错误
            $httpProvider.interceptors.push('authInterceptorService');
            $pageTitleProvider.setDefault('Weimob  Black Cat');
        })();
        (function() {
            //dialogsProvider配置
            dialogsProvider.setSize('md');
            $translateProvider.translations('zh-cn', {
                DIALOGS_ERROR: "Error",
                DIALOGS_ERROR_MSG: "An unknown error has occurred.",
                DIALOGS_CLOSE: "关闭",
                DIALOGS_PLEASE_WAIT: "Please Wait",
                DIALOGS_PLEASE_WAIT_ELIPS: "Please Wait...",
                DIALOGS_PLEASE_WAIT_MSG: "Waiting on operation to complete.",
                DIALOGS_PERCENT_COMPLETE: "%",
                DIALOGS_NOTIFICATION: "Notification",
                DIALOGS_NOTIFICATION_MSG: "Unknown application notification.",
                DIALOGS_CONFIRMATION: "Confirmation",
                DIALOGS_CONFIRMATION_MSG: "Confirmation required.",
                DIALOGS_OK: "确认",
                DIALOGS_YES: "确认",
                DIALOGS_NO: "取消"
            });
            $translateProvider.preferredLanguage('zh-cn');
        })();


    }]).run(
        ['$rootScope', '$state', '$stateParams', 'authService', '$pageTitle', '$config', '$locale', '$injector', '$localStorage','$toaster',
            function($rootScope, $state, $stateParams, authService, $pageTitle, $config, $locale, $injector, $localStorage,$toaster) {

                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.$config = $config;
                $rootScope.parseInt = parseInt;
                $rootScope.Date = Date;
                $rootScope.ticketParams = {}


                $rootScope.app = {
                    name: '后台管理系统',
                    version: '0.0.1',
                    color: {
                        primary: '#7266ba',
                        info: '#23b7e5',
                        success: '#27c24c',
                        warning: '#fad733',
                        danger: '#f05050',
                        light: '#e8eff0',
                        dark: '#3a3f51',
                        black: '#1c2b36'
                    },
                    settings: {
                        themeID: 13,
                        navbarHeaderColor: 'bg-dark',
                        navbarCollapseColor: 'bg-white-only',
                        asideColor: 'bg-dark',
                        headerFixed: true,
                        asideFixed: true,
                        asideFolded: false,
                        asideDock: false,
                        container: false
                    }
                };

                (function() {
                    //主题
                    //if (angular.isDefined($localStorage.settings)) {
                    //    $rootScope.app.settings = $localStorage.settings;
                    //} else {
                    //
                    //    $localStorage.settings = $rootScope.app.settings;
                    //}
                    $rootScope.$watch('app.settings', function(v) {
                        if ($rootScope.app.settings.asideDock && $rootScope.app.settings.asideFixed) {
                            $rootScope.app.settings.headerFixed = true;
                        }
                        $rootScope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');

                        //$localStorage.settings = $rootScope.app.settings;

                    }, true);
                })();

                $rootScope.toasterOptions = {
                    "position-class": "toast-top-center",
                    "time-out": 1000
                };
                (function() { //提示文字;
                    var localeZh = $injector.get("localeZh")
                    angular.extend($locale, localeZh);

                })();
                (function() { //授权验证

                    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

                        var popbox = $(".popover");
                        popbox.length > 0 && popbox.remove()

                        var fillAuthData = authService.fillAuthData();

                        $rootScope.userData_done = true;

                    })
                    $rootScope.locals = authService.fillAuthData(); //{isAuth:true|false,userData:obj,userRole:obj}
                    
                    //实用工具显示权限判断
                    $rootScope.showUseTool = function(){

                        return true;
                    }
                })();


                $rootScope.$on('$stateChangeSuccess', function(event, toState) {
                    $rootScope.loading_done = true;
                });
            }
        ]
    ).constant('$config', {
        host: {
            domain: 'ngthree.com',
            www: window.location.host,
            apifix: 'http://sbgo.cc:8066',
            stc: 'stc.ngthree.com',
            api: '/api',
            api2: "/api2",
            api3: "/api3",
            apiField: "/api3/Field",
            apiList: "/api3/List",
            apiPolicy: "/api3/Policy"
        },
        dateformat: 'yyyy-MM-dd hh:mm',
        dateformatdd: 'yyyy-MM-dd',
        debug: false,
        site: {
            name: '黑猫'
        },
        api3: {
            user: {
                login: "/login",
                logout: "/logout",
                info: "/info"
            },
            basisite:{
                list:"/api/Tower/List"
            },
            module: {
                cityList: "/api/Area/List"
            },
            organization: {
                list: '/api/Org/List',
                createCompany: '/api/Org/Company/Add',
                createApart: '/api/Org/Department/Add',
                companyDetail: "/api/Org/Company/Detail",
                apartmentDetail: "/api/Org/Department/Detail",
                companyList: "/api/Org/Company/List",
                elitCompany: "/api/Org/Company/Edit",
                editApartment: "/api/Org/Department/Edit"
            },
            fileupload: {
                upload: "/api/Images/UploadFiles"
            }
        },
        apiField: {
            fieldList: "/field/list",
            fieldListDict: "/field/list/dict"
        },
        apiList: {
            dictApplicaitonList: "/dict/applicaiton/list",
            sheetList: "/sheet/list",
            sheetEditDict: "/sheet/edit/dict",
            sheetAdd: "/sheet/add",
            sheetModify: "/sheet/modify",
            sheetDelete: "/sheet/delete",
            sheetdataListDict: "/sheetdata/list/dict",
            sheetdataList: "/sheetdata/list",
            sheetdataImport: "/sheetdata/import",
            sheetdataAdd: "/sheetdata/add",
            sheetdataDelete: "/sheetdata/delete",
            sheetdataModify: "/sheetdata/modify"

        },
        apiPolicy: {
            strategyList: "/strategy/list",
            strategyEditDict: "/strategy/edit/dict",
            strategyEditLevel: "/strategy/edit/level",
            strategySearch: "/strategy/edit/dict",
            strategyAdd: "/strategy/add",
            strategyDelete: "/strategy/delete",
            strategyModify: "/strategy/modify",
            ruleList: "/rule/list",
            ruleDisable: "/rule/disable",
            ruleEnable: "/rule/enable",
            ruleDelete: "/rule/delete",
            templateList: "/template/list",
            ruleDict: "/rule/dict",
            ruleAdd: "/rule/add",
            ruleModify: "/rule/modify",
            calc:"/rule/dict/calc",
            findById:"/strategy/findById",
            tacticSort:"/rule/sort"
        },
        role: {
          roleList: "/role/list",
          roleDict:"/role/dict",
          delRole: "role/delete",
          roleInfo: "/role/info",
          addRole: "/role/add",
          editRole: "/role/modify",
        },
        apiApplication: {
          applicationList: "/dict/application/list",
          applicationAdd: "/dict/application/add",
          applicationEdit: "/dict/application/modify",
          applicationDelete: "/dict/application/delete"
        },
        apiCustomer: {
          customerList: "/user/list",
          customerAdd: "/user/add",
          customerEdit: "/user/modify",
          customerDelete: "/user/delete",
          bachCustomerAdd:"/user/add/applications/roles",
          bachCustomerDelete:'/user/delete'
        }
    });
