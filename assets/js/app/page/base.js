module.exports = [
  '$rootScope', '$location', '$route', '$translate', '$filter', 'CommonUi', 'CommonConfig', 'CommonTracking', 'StorageService',
  function (
    $rootScope, $location, $route, $translate, $filter, CommonUi, CommonConfig, CommonTracking, StorageService
  ) {
    'use strict';
    var self = this;

    self.viewLocked = function () {
      return !!CommonUi.modal.template;
    };

    self.selectedLanguage = CommonConfig.selectedLanguage;

    self.supportedLanguages = [ 'de' ];
    $translate( [ 'COMMON.LANGUAGE.SUPPORTED_LANGUAGES' ] ).then( function ( translations ) {
      self.supportedLanguages = JSON.parse( translations[ 'COMMON.LANGUAGE.SUPPORTED_LANGUAGES' ] );
    } );

    self.changeLanguage = function ( key ) {
      var previousLanguage = self.selectedLanguage,
        languageNotification = $filter( 'translate' )( 'COMMON.LANGUAGE.LANGUAGE_CHANGED' )
        .replace( '%OLD%', $filter( 'translate' )( 'COMMON.LANGUAGE.' + previousLanguage.toUpperCase() ) )
        .replace( '%NEW%', $filter( 'translate' )( 'COMMON.LANGUAGE.' + key.toUpperCase() ) );

      $translate.use( key ).then( function ( key ) {
        self.selectedLanguage = key;

        CommonConfig.selectedLanguage = self.selectedLanguage;
        StorageService.set( 'selectedLanguage', self.selectedLanguage );
      } );
    };

    CommonTracking.init();

    $rootScope.$on( '$locationChangeSuccess', function () {
      if ( $route && $route.current && $route.current.originalPath ) {
        CommonTracking.addEvent( 'page', $route.current.originalPath );
      }
    } );

    self.printReturnLabel = function ( trackingId ) {
      CommonTracking.addEvent( 'track', 'print-return-label-button was clicked.' );
      if ( trackingId ) {
        $location.path( '/printing/' + trackingId );
      }
    };

    self.printLabel = function () {
      CommonTracking.addEvent( 'track', 'print-label-button was clicked.' );
    };

    self.banner = {
      title: $filter( 'translate' )( 'SECTION.FOOTER.TITLE' ),
      subtitle: $filter( 'translate' )( 'SECTION.FOOTER.SUBTITLE' )
    };

    self.languageSelectConfiguration = {
      default: self.selectedLanguage,
      changed: function ( language ) {
        self.changeLanguage( language.code );
      }
    };

    self.env = CommonConfig.environment();
  }
];
