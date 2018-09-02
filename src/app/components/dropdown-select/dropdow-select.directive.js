'use strict';


// <div class="btn-group" dropdown dropdown-select
// data-list='[ {title:"全部类型",value:""}, {title:"藍光燒錄",value:"藍光燒錄"}, {title:"玄幻奇異",value:"玄幻奇異"}]'  //有list就不会去ajax
// ng-model="selevalue" data-path="plus/data/article.php" >

angular.module('ngTicket')
    .directive('dropdownSelect', ['$timeout', 'RootRestangular', '$q', function($timeout, RootRestangular, $q) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                path: '@',
                list: '=',
                selected:"&"
            },
            templateUrl: '/app/components/dropdown-select/dropdown-select.html',
            link: function(scope, iElement, iAttrs, ngModelCtrl) {
                var deferred = $q.defer();
                var size=iElement.data("size");
                scope.dropdownselectsize=angular.isUndefined(size)?"btn-sm":size;
                scope.select = function(item) {
                    scope.checked = item;
                    ngModelCtrl.$setViewValue(item.value)
                    scope.selected()

                };

                function asyncList() {
                    if (scope.list) {
                        deferred.resolve(scope.list);
                    } else if (scope.path) {
                        RootRestangular.all(scope.path).getList().then(function(data) {
                            deferred.resolve(data);
                        }, function(error) {
                            deferred.reject(error);
                        })
                    } else {
                        scope.$watch("list", function(v) {
                            if (!angular.isUndefined(v)) {
                                deferred.resolve(v);
                            };
                        })
                    }
                    return deferred.promise;
                }
                asyncList().then(function(data) {
                    scope.data = data;
                    if (!angular.isUndefined(scope.value)) {
                        angular.forEach(data, function(item) {
                            if (item.value == scope.ngModel) scope.checked = item;
                            if (item.value == ngModelCtrl.$viewValue) {
                                scope.checked = item
                            }
                        });
                    }
                    if (!scope.checked && data.length > 0) scope.checked = data[0];
                }, function(description) {
                    console.error(description);
                });

                if (scope.ngModel && !scope.value) scope.value = scope.ngModel;
            }
        };
    }]);
