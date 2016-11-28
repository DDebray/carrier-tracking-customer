'use strict';
/**
 * Module for language selection
 * @method exports
 * @return {function}
 */
module.exports = function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      config: '=config'
    },
    templateUrl: '/views/partials/language_select.html',
    link: function ( scope, element, attr ) {

      /**
       * Adapt language to translation key convention for languages
       * @method getTranslation
       * @param  {[type]}       lang [description]
       * @return {[type]}            [description]
       */
      var getTranslation = function ( lang ) {
        return 'COMMON.LANGUAGE.' + lang;
      }

      /**
       * Default module configuration
       * @type Object
       */
      var config = {
        default: 'EN',
        languages: [ {
          code: 'EN',
          translation: getTranslation( 'EN' )
        }, {
          code: 'DE',
          translation: getTranslation( 'DE' )
        } ],
        changed: function ( language ) {
          console.log( "Please specify a change event" )
        }
      };

      /**
       * Select the right language from default country code
       * @method setDefault
       */
      var setDefault = function () {
        var defaultObj = config.languages.filter( function ( l ) {
          return l.code === config.default.toUpperCase();
        } )[ 0 ];
        var index = config.languages.indexOf( defaultObj );
        config.languages.splice( index, 1 );
        config.languages.unshift( defaultObj );
      };

      /**
       * Change to a given language
       * @method changeLanguage
       * @param  {[type]}       language [description]
       * @return {[type]}                [description]
       */
      scope.changeLanguage = function ( language ) {
        var index = config.languages.indexOf( language );
        config.languages.splice( index, 1 );
        config.languages.unshift( language );
        config.changed( language );
      };

      /**
       * Initialize module
       * @method init
       * @return {[type]} [description]
       */
      var init = function () {
        window.angular.extend( config, scope.config );
        setDefault();
        scope.languages = config.languages;
      };

      // Initialize module
      init();

    }
  };
};
