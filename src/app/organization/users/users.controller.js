(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('usersManagementCtrl', usersManagementCtrl)
  ;
  /* @ngInject */
  function usersManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
