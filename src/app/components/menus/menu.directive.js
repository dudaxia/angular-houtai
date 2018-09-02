/*
 * @Author: hui.wang 
 * @Date: 2017-10-16 10:35:45 
 * @Last Modified by: hui.wang
 * @Last Modified time: 2017-10-24 11:08:39
 */
/* 用法： <div class="col-sm-2" subside-menu content-url="" center="false"></div>
content-url：右侧显示内容的请求地址
center:true|false,是否有产品中心
current-menu:选中的菜单
 */

;
(function () {
  angular.module('ngTicket').directive('subsideMenu', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          // layout:"=",    // 2 为横向展开式布局；1 为纵向菜单布局
          hasCenter: "=", //有无产品中心
          currentMenu: '=?', //当前菜单信息
          isCenter: "=?", //产品中心
          getContentDetail: '&'
        },
        controller: "subsideMenuCtrl",
        templateUrl: "/app/components/menus/menu.tpl.html",
        link: function (scope, element, attrs) {}
      };
    }
  ]);
})();
