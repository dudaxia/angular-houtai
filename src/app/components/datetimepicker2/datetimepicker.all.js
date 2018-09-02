'use strict';

angular.module('ngTicket')
    .directive('datetimepicker2', ['$timeout', '$q', function($timeout, $q) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
                required:"=?"
            },
            templateUrl: '/app/components/datetimepicker2/datetimepicker.html',
            link: function(scope, iElement, iAttrs, ngModelCtrl) {

                ngModelCtrl.$render = function() {
                    scope.date = ngModelCtrl.$viewValue; 
                }
                scope.$watch("date", function(newdate) {
                    ngModelCtrl.$setViewValue(newdate);
                    // ngModelCtrl.$setValidity('valid', true);
                    
                })



            }
        };
    }]);
