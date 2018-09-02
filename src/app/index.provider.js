'use strict';

angular.module('ngTicket').provider('$pageTitle', function() {
    var defaultTitle;

    this.setDefault = function(value) {
        defaultTitle = value;
    }; 
    function PageTitleService($rootScope, $window) {

        function _get() {
            return $window.document.title;
        }
 
        function _set() {
            var parts, value= arguments.length > 0 ?Array.prototype.slice.call(arguments):defaultTitle; 
            parts=angular.isString(value)?value:value.concat(defaultTitle).join(" - ");
            $window.document.title = parts;
        }
 
        if (defaultTitle) {
            $window.document.title = defaultTitle;
        } else {
            defaultTitle = $window.document.title;
        }
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            var _pageTitle; 
            if (toState && angular.isDefined(toState.data)) {
                _pageTitle = toState.data.pageTitle || null; 
            } 
            _pageTitle?_set(_pageTitle):_set();
         
        });

        return {
            get: _get,
            set: _set
        }
    }

    this.$get = ['$rootScope', '$window', PageTitleService];
});
