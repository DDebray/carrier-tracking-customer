var angular = require('angular');
require('angular-resource'); // $resource
require('angular-route'); // $route
require('angular-translate'); // $translate
require('angular-hotkeys'); // hotkeys

var application = angular.module('application', ['ngResource', 'ngRoute', 'pascalprecht.translate', 'cfp.hotkeys']);
require('./common/filters')(application);
require('./common/directives')(application);

application
  .provider('CommonConfig', require('./common/config'))

  .config(require('./route'))

  .factory('$translateUrlLoader', require('./translation/service'))
  .factory('CommonRequest', require('./common/request'))
  .factory('CommonBrowser', require('./common/browser'))
  .factory('CommonMoment', require('./common/moment'))

  .provider('CommonUi', require('./ui/config'))
  .controller('UiCtrl', require('./ui/controller'))

  .controller('PageBaseCtrl', require('./page/base'))
  // .controller('PageDashboardCtrl', require('./page/dashboard'))
  .controller('PageTrackingCtrl', require('./page/tracking'))
  ;

module.exports = application;
