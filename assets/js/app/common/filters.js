module.exports = function (application) {
  'use strict';

  application
    .filter('raw', ['$sce', function ($sce) {
      return function (val) {
        return $sce.trustAsHtml(val);
      };
    }])
    .filter('moment', ['CommonMoment', function (CommonMoment) {
      return function (input, expression) {
        if (!input) {
          return '';
        }

        if (input.isValid()) {
          switch (expression) {

            case 'long' :
              return input.format('dddd[, ]DD.MM.YYYY[, ]h:mm[ Uhr]');
            case 'day' :
              return input.format('dddd[, ]DD.MM.');
            case 'time' :
              return input.format('h:mm [ Uhr]');
            default:
              return input.format('DD.MM.YYYY');
          }
        }

        return input;
      };
    }])
    ;
};
