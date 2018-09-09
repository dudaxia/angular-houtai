
;
(function() {
    'use strict';
    angular.module('ngTicket')
    .controller('subTreeCtrl', ['$scope', '$toaster', '$config', '$locale',  '$state',  '$rootScope', 'ipCookie', '$timeout','$stateParams',
        function($scope, $toaster, $config, $locale, $state, $rootScope, ipCookie, $timeout,$stateParams) {

            // console.log("$scope.subtreeList",$scope.subtreeList)
            $scope.onClickItem = function(id,item){
                $scope.activeItemId = item.subData&&item.subData.length ? "" : id;
                $scope.getCompanyDetail(id) ; 
                $rootScope.$broadcast("queryCompanyDetail",{id:id,level:item.level});
            }

            $scope.showSubItem = function(item){
                item.show = !item.show;
                event.stopPropagation()
            }

            $scope.addDepartment = function (item) {
                $rootScope.$broadcast("addDepartment",{data:item});
                event.stopPropagation()
            }
            

           
        }
    ]);
})();
