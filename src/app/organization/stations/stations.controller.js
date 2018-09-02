(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('stationsManagementCtrl', stationsManagementCtrl)
  ;
  /* @ngInject */
  function stationsManagementCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
