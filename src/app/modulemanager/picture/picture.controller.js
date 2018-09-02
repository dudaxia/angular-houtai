(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('pictureModuleManagerCtrl', pictureModuleManagerCtrl)
  ;
  /* @ngInject */
  function pictureModuleManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }

})();
