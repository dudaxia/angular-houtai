(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('inprocessManagerCtrl', inprocessManagerCtrl)
    .controller('doneprocessManagerCtrl', doneprocessManagerCtrl)
  ;
  /* @ngInject */
  function inprocessManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
  function doneprocessManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
