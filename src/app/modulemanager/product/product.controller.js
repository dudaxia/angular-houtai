(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('productModuleManagerCtrl', productModuleManagerCtrl)
  ;
  /* @ngInject */
  function productModuleManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }

})();
