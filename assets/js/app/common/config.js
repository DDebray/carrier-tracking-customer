module.exports = [ '$translateProvider', function ( $translateProvider ) {
  'use strict';

  var self = this,
    environment = require( '../environment' );

  self.selectedLanguage = 'de';
  self.$get = [ 'StorageService', '$translate', function ( StorageService, $translate ) {
    self.selectedLanguage = StorageService.get( 'selectedLanguage' ) || self.selectedLanguage;
    $translate.use( self.selectedLanguage );
    return self;
  } ];

  self.environment = function () {
    return environment;
  };

  self.endpoints = {
    ui: {
      development: 'https://api-testing.coureon.com/ui/',
      testing: 'https://api-testing.coureon.com/ui/',
      staging: 'https://api-staging.coureon.com/ui/',
      production: 'https://api.coureon.com/ui/'
    },
    cx: {
      local: 'http://localhost:8080/cx/',
      development: 'https://api-testing.coureon.com/cx/',
      testing: 'https://api-testing.coureon.com/cx/',
      staging: 'https://api-staging.coureon.com/cx/',
      production: 'https://api.coureon.com/cx/'
    },
    return: {
      local: 'http://localhost:8080/return/',
      development: 'https://api-testing.coureon.com/return/',
      testing: 'https://api-testing.coureon.com/return/',
      staging: 'https://api-staging.coureon.com/return/',
      production: 'https://api.coureon.com/return/'
    },
    www: {
      development: 'http://localhost:3000',
      testing: 'https://www-testing.coureon.com',
      staging: 'https://www-staging.coureon.com',
      production: 'https://www.coureon.com'
    }
  };

  self.endpoints.cms = {
    development: self.endpoints.www.development + '/',
    testing: self.endpoints.www.testing + '/',
    staging: self.endpoints.www.staging + '/',
    production: self.endpoints.www.production + '/'
  };

  $translateProvider.useUrlLoader( self.endpoints.cx[ environment ] + 'translations/tracking/' );
  $translateProvider.useSanitizeValueStrategy( 'escapeParameters' );
  $translateProvider.preferredLanguage( self.selectedLanguage );
} ];
