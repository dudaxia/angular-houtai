(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('commentModuleManagerCtrl', commentModuleManagerCtrl)
  ;
  /* @ngInject */
  function commentModuleManagerCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, listServer, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }

})();
