module.exports = [function () {
  'use strict';

  var
    environment = require('../environment'),
    writeKeys = {
      development : 'DLXuoEBMP7DUE1qAcxCjyMBGyzvQn2u7',
      testing : 'DLXuoEBMP7DUE1qAcxCjyMBGyzvQn2u7',
      production : 'lqgxg5Mw8orYLgoJDirIVVhw0lQRpPrA'
    },
    loadDelay = 4000, // because some heavy scripts like intercom might be loaded
    enableIn = ['development', 'testing', 'production'];

  var config = {
    init: function () {
      if (enableIn.indexOf(environment) === -1) {
        return;
      }

      window.analyticsCallback = config.load;
      window.setTimeout(function() {
        var
          firstScript = document.getElementsByTagName('script')[0],
          snippet = document.createElement('script');
        snippet.async = true;
        snippet.src = '/js/vendor/segment-analytics.js';
        firstScript.parentNode.insertBefore(snippet, firstScript);
      }, loadDelay);
    },
    load : function(container) {
      container.load(writeKeys[environment]);
      config.addEvent('ready');
    },
    initialized : {},
    addEvent : function(event, identifier, options, additional) {
      if (enableIn.indexOf(environment) === -1) {
        return;
      }

      if (!window.analytics || !window.analytics.initialize || (event !== 'page' && !config.initialized.page)) {
        return window.setTimeout(function() {
          config.addEvent(event, identifier, options, additional);
        }, 300);
      }

      config.initialized[event] = true;
      window.analytics[event](identifier, options, additional);
    }
  };

  return config;
}];
