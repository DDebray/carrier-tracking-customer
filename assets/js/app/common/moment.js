module.exports = [ function () {
  'use strict';

  var self = this,
    moment = require( 'moment' ), 
    german = require('moment/locale/de'),
    france = require('moment/locale/fr'),
    italian = require('moment/locale/it'),
    spanish = require('moment/locale/es'),
    portuguese = require('moment/locale/pt');

  var config = {
    init: function () {
      moment.locale('de');
      return moment;
    }
  };

  return config.init();
} ];
