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
    ui : {
      development : 'http://localhost:8080/zooron-web/ui/',
      testing : 'https://api-testing.coureon.com/ui/',
      staging : 'https://api-staging.coureon.com/ui/',
      production : 'https://api.coureon.com/ui/'
    },
    cx : {
      development : 'https://api-testing.coureon.com/cx/',
      testing : 'https://api-testing.coureon.com/cx/',
      staging : 'https://api-staging.coureon.com/cx/',
      production : 'https://api.coureon.com/cx/'
    },
    ruediger : {
      development : 'http://172.30.8.34:8081/external/',
      testing : 'http://172.30.8.34:8081/external/',
      staging : 'http://172.30.8.34:8081/external/',
      production : 'http://172.30.8.34:8081/external/'
    },
    www : {
      development: 'http://localhost:3000',
      testing : 'https://www-testing.coureon.com',
      staging : 'https://www-staging.coureon.com',
      production : 'https://www.coureon.com'
    }
  };

  self.endpoints.cms = {
    development : self.endpoints.www.development + '/',
    testing : self.endpoints.www.testing + '/',
    staging : self.endpoints.www.staging + '/',
    production : self.endpoints.www.production + '/'
  };

  $translateProvider.useUrlLoader(self.endpoints.cx[environment] + 'translations/tracking/');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.preferredLanguage('de');
}];
