(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('departmentManagementCtrl', departmentManagementCtrl)
  ;
  /* @ngInject */
  function departmentManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
