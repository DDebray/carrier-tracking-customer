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
      development : 'https://api-testing.coureon.com/ui/',
      // development : 'http://localhost:8080/zooron-web/ui/',
      testing : 'https://api-testing.coureon.com/ui/',
      staging : 'https://api-staging.coureon.com/ui/',
      production : 'https://api.coureon.com/ui/'
    },
    www : {
      development: 'http://localhost:3000/login',
      // development : 'https://www-local.coureon.com',
      // development : 'http://localhost:8080',
      testing : 'https://www-testing.coureon.com',
      staging : 'https://www-staging.coureon.com',
      production : 'https://www.coureon.com'
    }
  };

  self.endpoints.cms = {
    development : self.endpoints.www.development + '/',
    testing : self.endpoints.www.production + '/',
    staging : self.endpoints.www.production + '/',
    production : self.endpoints.www.production + '/'
  };

  console.log('environment', environment);
  console.log('self.endpoints.ui', self.endpoints.ui);

  $translateProvider.useUrlLoader(self.endpoints.ui[environment] + 'translations/');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.preferredLanguage('de');
}];
