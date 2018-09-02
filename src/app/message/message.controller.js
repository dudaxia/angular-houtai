(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('messageListCtrl', messageListCtrl)
    .controller('sendMessageCtrl', sendMessageCtrl)
  ;
  /* @ngInject */
  function messageListCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
  function sendMessageCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
