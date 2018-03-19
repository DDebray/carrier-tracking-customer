module.exports = [ '$routeProvider', '$locationProvider', '$httpProvider', 'CommonConfigProvider', 'CommonUiProvider', function ( $routeProvider, $locationProvider, $httpProvider, CommonConfig, CommonUi ) {
  'use strict';

  var needsToBeLoggedIn = false;
  var independentPageResolver = function () {
    needsToBeLoggedIn = false;
  };

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push( [ '$q', '$location', '$translate', function ( $q, $location, $translate ) {
    return {
      request: function ( config ) {
        CommonUi.busy = true;
        return config;
      },
      requestError: function ( rejection ) {
        return $q.reject( rejection );
      },
      response: function ( response ) {
        CommonUi.busy = false;
        return response;
      }
    };
  } ] );

  $locationProvider.html5Mode( true );

  $routeProvider
    .when( '/', {
      // the controller is set in the index.html template,
      // as it needs to exists side by side with the routing controllers
      templateUrl: 'views/landingpage.html',
      resolve: independentPageResolver
    } )
    .when( '/tracking/:trackingId', {
      controller: 'PageTrackingCtrl as tracking',
      templateUrl: 'views/tracking.html',
      resolve: independentPageResolver
    } )
    .when( '/printing/:trackingId', {
      controller: 'PagePrintingCtrl as printing',
      templateUrl: 'views/printing.html',
      resolve: independentPageResolver
    } )
    .otherwise( {
      redirectTo: '/'
    } );
} ];
