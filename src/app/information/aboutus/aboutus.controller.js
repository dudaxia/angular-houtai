(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('aboutusMessageCtrl', aboutusMessageCtrl)
  ;
  /* @ngInject */
  function aboutusMessageCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
