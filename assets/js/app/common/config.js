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
      testing : 'https://api-testing.coureon.com/ui/',
      staging : 'https://api-staging.coureon.com/ui/',
      production : 'https://api.coureon.com/ui/'
    },
    www : {
      development: 'http://localhost:3000',
      testing : 'https://www-testing.coureon.com',
      staging : 'https://www-staging.coureon.com',
      production : 'https://www.coureon.com'
    },
    app : {
      development: 'http://localhost:3000/login',
      testing : 'https://app-testing.coureon.com/login',
      staging : 'https://app-staging.coureon.com/login/',
      production : 'https://app.coureon.com/login'
    }
  };

  self.endpoints.cms = {
    development : self.endpoints.www.development + '/',
    testing : self.endpoints.www.testing + '/',
    staging : self.endpoints.www.staging + '/',
    production : self.endpoints.www.production + '/'
  };

  $translateProvider.useUrlLoader(self.endpoints.ui[environment] + 'translations/tracking/');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.preferredLanguage('de');
}];