(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('feedbackMessageCtrl', feedbackMessageCtrl)
  ;
  /* @ngInject */
  function feedbackMessageCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
