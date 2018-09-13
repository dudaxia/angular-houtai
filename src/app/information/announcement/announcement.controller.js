(function() {
  'use strict';

  angular
    .module('ngTicket')
    .controller('announcementMessageCtrl', announcementMessageCtrl)
  ;
  /* @ngInject */
  function announcementMessageCtrl($rootScope,$scope, $state, $stateParams, $config, tableHelp, $timeout, $toaster) {
    $scope.$on('reload', function () {
      $state.reload();
    })
    

    
  }
})();
