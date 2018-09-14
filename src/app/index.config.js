'use strict';

angular.module('ngTicket')
    .config(['RestangularProvider', '$httpProvider', '$config', '$pageTitleProvider', 'dialogsProvider', '$translateProvider', function(RestangularProvider, $httpProvider, $config, $pageTitleProvider, dialogsProvider, $translateProvider) {

        RestangularProvider.setBaseUrl($config.host.api);

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
                    $rootScope.$watch('app.settings', function(v) {
                        if ($rootScope.app.settings.asideDock && $rootScope.app.settings.asideFixed) {
                            $rootScope.app.settings.headerFixed = true;
                        }
                        $rootScope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
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
                    $rootScope.locals = authService.fillAuthData();
                    
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
        },
        dateformat: 'yyyy-MM-dd hh:mm',
        dateformatdd: 'yyyy-MM-dd',
        debug: false,
        site: {
            name: '后台管理系统'
        },
        api3: {
            user: {
                login: "/login",
                logout: "/logout",
                info: "/info"
            },
            basisite:{
                list:"/api/Tower/List",
                productlist: "/api/ProductConfig/List",
                addProduct: "/api/ProductConfig/Add",
                editProduct: "/api/ProductConfig/Edit",
                feedbacklist: "/api/ContactUs/List",
                chulifeedback: "/api/ContactUs/Audit"
            },
            module: {
                cityList: "/api/Area/List",
                addArea: "/api/Area/Add",
                moduleList: "/api/Module/List",
                addProcess: "/api/Module/Add",
                addProcessForm: "/api/Module/AddForm",
                formDetail: "/api/Module/FormDetail",
                deleteForm: "/api/Module/DeleteForm",
            },
            organization: {
                list: '/api/Org/List',
                createCompany: '/api/Org/Company/Add',
                createApart: '/api/Org/Department/Add',
                companyDetail: "/api/Org/Company/Detail",
                apartmentDetail: "/api/Org/Department/Detail",
                companyList: "/api/Org/Company/List",
                elitCompany: "/api/Org/Company/Edit",
                editApartment: "/api/Org/Department/Edit",
                areaTreeList: "/api/Area/TreeList",
                userlist: "/api/Org/User/List",
                stationlist: "/api/Org/Role/List",
                addUser: "/api/Org/User/Add",
                stationuserlist:"/api/Org/Role/UserList",
                stationUserAdd:"/api/Org/Role/Add",
                stationUserAddUser: "/api/Org/Role/AddUser"
            },
            fileupload: {
                upload: "/api/Images/UploadFiles"
            },
            process: {
                processList: "/api/Work/Category",
                addProcess: "/api/Work/AddCategory",
                editProcess: "/api/Work/EditCategory"
            }
        },
    
    });
