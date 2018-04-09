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
    link: function (scope, element, attr) {

      /**
       * Adapt language to translation key convention for languages
       * @method getTranslation
       * @param  {[type]}       lang [description]
       * @return {[type]}            [description]
       */
      var getTranslation = function (lang) {
        return 'COMMON.LANGUAGE.' + lang;
      };

      /**
       * Default module configuration
       * @type Object
       */
      var config = {
        default: 'EN',
        languages: [{
          code: 'EN',
          cssIdentifier: 'GB',
          translation: getTranslation('EN')
        }, {
          code: 'DE',
          cssIdentifier: 'DE',
          translation: getTranslation('DE')
        }, {
          code: 'IT',
          cssIdentifier: 'IT',
          translation: getTranslation('IT')
        }, {
          code: 'FR',
          cssIdentifier: 'FR',
          translation: getTranslation('FR')
        }, {
          code: 'ES',
          cssIdentifier: 'ES',
          translation: getTranslation('ES')
        }],
        changed: function (language) {
          console.log('Please specify a change event');
        }
      };

      /**
       * Select the right language from default country code
       * @method setDefault
       */
      var setDefault = function () {

		    var browserLang = window.navigator.languages[0]; 					// get preferred language from browser
        var preferredLang = window.localStorage.getItem('prefLang');		// get preferred language by user
        var prefFlag = 0;
        var browserFlag = 0;
        if (preferredLang == null || preferredLang == undefined) {
			    prefFlag = 0;
        } else {
			    prefFlag = 1;
		    }
		    if(browserLang == null || browserLang == undefined) {
			     browserFlag = 0;
        } else {
		    	browserFlag = 1;
		    }

		    if (prefFlag) {
		      var defaultObj = config.languages.filter(function (l) {
			      return l.code === preferredLang.toUpperCase();
          })[0];
		    } else if(browserFlag) {
		      var defaultObj = config.languages.filter(function (l) {
			      return l.code === browserLang.toUpperCase();
          })[0];
		    } else {
		      var defaultObj = config.languages.filter(function (l) {
            return l.code === config.default.toUpperCase();
          })[0];
		    }
        var index = config.languages.indexOf(defaultObj);
        config.languages.splice(index, 1);
        config.languages.unshift(defaultObj);
      };

      /**
       * Change to a given language
       * @method changeLanguage
       * @param  {[type]}       language [description]
       * @return {[type]}                [description]
       */
      scope.changeLanguage = function (language) {
        var index = config.languages.indexOf(language);
		    window.localStorage.setItem('prefLang',config.languages[index].code);	//Store user preferred language in a local storage variable
        config.languages.splice(index, 1);
        config.languages.unshift(language);
        config.changed(language);
      };

      /**
       * Initialize module
       * @method init
       * @return {[type]} [description]
       */
      var init = function () {
        window.angular.extend(config, scope.config);
        setDefault();
        scope.languages = config.languages;
      };

      // Initialize module
      init();

    }
  };
};
