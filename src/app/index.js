'use strict';
(function() {
  window.env = {};
  var host = window.location.host;
  if (host.indexOf('blackcat.dev.weimob.com') > -1) {
    window.env.development = true;
    window.env.cookieName="weimobAuthDataCloud_blackcat_dev";
  } else if (host.indexOf('blackcat.saas.weimobqa.com') > -1) {
    window.env.qa = true;
    window.env.cookieName="weimobAuthDataCloud_blackcat_qa";
  } else if (host.indexOf('blackcat.pl.weimob.com') > -1) {
    window.env.pl = true;
    window.env.cookieName="weimobAuthDataCloud_blackcat_pl";
  } else if (host.indexOf('blackcat.weimob.com') > -1) {
    window.env.production = true;
    window.env.cookieName="weimobAuthDataCloud_blackcat";
  } else {
    window.env.locals = true;
    window.env.cookieName="weimobAuthDataCloud_locals_blackcat";
  }
})();
angular.module('ngTicket', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'restangular',
    'ui.router',
    'ng-nestable',
    'ui.bootstrap',
    //'uiSwitch',
    'ui.checkbox',
    'ngStorage',
    'ngTable',
    'daterangepicker',
    'toaster',
    'ui.select',
    'ui.bootstrap.datetimepicker',
    'angularFileUpload',
    'ipCookie',
    'dialogs.main',
    'ui.sortable'
]);
