(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('processListCtrl', processListCtrl)
  ;
  /* @ngInject */
  function processListCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
