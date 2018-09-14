'use strict';

angular.module('ngTicket')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $stateProvider
            .state('/', {
                url: '/',
                controller: 'allCtrl',
                abstract: true
            })
            .state('app', {
                url: '/app',
                abstract: true,
                controller: 'blocksCtrl',
                templateUrl: '/app/app.html'
            })
            .state('app.dashboard', {
                url: '/dashboard',
                controller: '',
                data: {
                    pageTitle: '后台管理系统'
                },
                templateUrl: '/app/dashboard/dashboard.html'
            });

        (function(list) {
            //二级路由添加
            angular.forEach(list, function(item) {
                $stateProvider.state('app.{0}'.format(item), {
                    url: '/{0}'.format(item),
                    abstract: true,
                    name: '{0}'.format(item),
                    template: '<section class="vbox" ui-view><section>'
                })
            });
        })(["tactics","management","managecenter","organization","basisite","process","information","message","workmanager","modulemanager"])


        $stateProvider.state('access', {
                url: '/access',
                abstract: true,
                template: '<div ui-view ></div>'
            })
            .state('access.signin', {
                url: '/signin',
                controller: 'signinCtrl',
                data: {
                    pageTitle: '登录'
                },
                templateUrl: '/app/access/signin.html'
            })
            .state('access.signup', {
                url: '/signup',
                controller: 'signupCtrl',
                data: {
                    pageTitle: 'signup'
                },
                templateUrl: '/app/access/signup.html'
            })
            .state('app.organization.company', {
                url: '/company',
                controller: 'companyManagementCtrl',
                data: {
                    pageTitle: '公司管理'
                },
                templateUrl: '/app/organization/company/company.html'
            })
            .state('app.organization.department', {
                url: '/department',
                controller: 'departmentManagementCtrl',
                data: {
                    pageTitle: '部门管理'
                },
                templateUrl: '/app/organization/department/department.html'
            })
            .state('app.organization.stations', {
                url: '/stations',
                controller: 'stationsManagementCtrl',
                data: {
                    pageTitle: '岗位管理'
                },
                templateUrl: '/app/organization/stations/stations.html'
            })
            .state('app.organization.stationsUserList', {
                url: '/stationsUserList/:id',
                controller: 'stationsUserListCtrl',
                data: {
                    pageTitle: '岗位管理'
                },
                templateUrl: '/app/organization/stations/stations.userList.html'
            })
            .state('app.organization.users', {
                url: '/users',
                controller: 'usersManagementCtrl',
                data: {
                    pageTitle: '用户管理'
                },
                templateUrl: '/app/organization/users/users.html'
            })
            .state('app.basisite.maintain', {
                url: '/maintain',
                controller: 'maintainManagementCtrl',
                data: {
                    pageTitle: '基站维护'
                },
                templateUrl: '/app/basisite/maintain.html'
            })
            .state('app.basisite.product', {
                url: '/product',
                controller: 'productManagementCtrl',
                data: {
                    pageTitle: '产品维护'
                },
                templateUrl: '/app/basisite/product.html'
            })
            .state('app.basisite.add', {
                url: '/add?id',
                controller: 'addMaintainManagementCtrl',
                data: {
                    pageTitle: '新增基站'
                },
                templateUrl: '/app/basisite/add.maintain.html'
            })
            .state('app.process.list', {
                url: '/list',
                controller: 'processListCtrl',
                data: {
                    pageTitle: '流程列表'
                },
                templateUrl: '/app/process/process.list.html'
            })
            .state('app.process.setlist', {
                url: '/setlist/:id',
                controller: 'setProcessListCtrl',
                data: {
                    pageTitle: '流程列表'
                },
                templateUrl: '/app/process/setProcess.list.html'
            })
            .state('app.information.feedback', {
                url: '/feedback',
                controller: 'feedbackMessageCtrl',
                data: {
                    pageTitle: '用户反馈'
                },
                templateUrl: '/app/information/feedback/feedback.html'
            })
            .state('app.information.aboutus', {
                url: '/aboutus',
                controller: 'aboutusMessageCtrl',
                data: {
                    pageTitle: '关于我们'
                },
                templateUrl: '/app/information/aboutus/aboutus.html'
            })
            .state('app.information.announcement', {
                url: '/announcement',
                controller: 'announcementMessageCtrl',
                data: {
                    pageTitle: '系统公告'
                },
                templateUrl: '/app/information/announcement/announcement.html'
            })
            .state('app.message.send', {
                url: '/send',
                controller: 'sendMessageCtrl',
                data: {
                    pageTitle: '发送消息'
                },
                templateUrl: '/app/message/sendMessage.html'
            })
            .state('app.message.list', {
                url: '/list',
                controller: 'messageListCtrl',
                data: {
                    pageTitle: '消息列表'
                },
                templateUrl: '/app/message/message.list.html'
            })
            .state('app.workmanager.inprocess', {
                url: '/send',
                controller: 'inprocessManagerCtrl',
                data: {
                    pageTitle: '进行中流程'
                },
                templateUrl: '/app/workmanager/inprocess.list.html'
            })
            .state('app.workmanager.doneprocess', {
                url: '/list',
                controller: 'doneprocessManagerCtrl',
                data: {
                    pageTitle: '已完成流程'
                },
                templateUrl: '/app/workmanager/doneprocess.list.html'
            })
            .state('app.modulemanager.city', {
                url: '/city',
                controller: 'cityModuleManagerCtrl',
                data: {
                    pageTitle: '城区管理'
                },
                templateUrl: '/app/modulemanager/city/city.list.html'
            })
            .state('app.modulemanager.picture', {
                url: '/picture',
                controller: 'pictureModuleManagerCtrl',
                data: {
                    pageTitle: '流程模块'
                },
                templateUrl: '/app/modulemanager/picture/picture.list.html'
            })
            .state('app.modulemanager.picedit', {
                url: '/picedit/:id',
                controller: 'pictureEditCtrl',
                data: {
                    pageTitle: '流程模块'
                },
                templateUrl: '/app/modulemanager/picture/picture.edit.html'
            })
            .state('app.modulemanager.comment', {
                url: '/comment',
                controller: 'commentModuleManagerCtrl',
                data: {
                    pageTitle: '备注管理'
                },
                templateUrl: '/app/modulemanager/comment/comment.list.html'
            })
            .state('app.modulemanager.product', {
                url: '/product',
                controller: 'productModuleManagerCtrl',
                data: {
                    pageTitle: '产品配置'
                },
                templateUrl: '/app/modulemanager/product/product.list.html'
            })

            // $urlRouterProvider.otherwise('/app/dashboard');
            $urlRouterProvider.otherwise('/access/signin');
    });
