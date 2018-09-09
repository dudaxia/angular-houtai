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
  angular.module('ngTicket').directive('subTree', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          subtreeList: '=?', //当前菜单信息
          getCompanyDetail: '&'
        },
        controller: "subTreeCtrl",
        templateUrl: "/app/components/subtree/subtree.tpl.html",
        link: function (scope, element, attrs) {}
      };
    }
  ]);
})();
