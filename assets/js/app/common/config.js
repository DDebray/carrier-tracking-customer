module.exports = ['$translateProvider', function ($translateProvider) {
  'use strict';

  var self = this,
    environment = require('../environment');

  self.$get = function() {
    return self;
  };

  self.environment = function() {
    return environment;
  };

  self.endpoints = {
    cx : {
      development : 'http://localhost:8080/zooron-web/cx/',
      testing : 'https://api-testing.coureon.com/ui/',
      production : 'https://api.coureon.com/ui/'
    },
    www : {
      development: 'http://localhost:3000',
      testing : 'https://www-testing.coureon.com',
      production : 'https://www.coureon.com'
    }
  };

  self.endpoints.cms = {
    development : self.endpoints.www.development + '/',
    testing : self.endpoints.www.production + '/',
    staging : self.endpoints.www.production + '/',
    production : self.endpoints.www.production + '/'
  };

  $translateProvider.useUrlLoader(self.endpoints.cx[environment] + 'translations/tracking/');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.preferredLanguage('de');
}];
