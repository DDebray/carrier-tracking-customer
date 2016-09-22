module.exports = function (application) {
  'use strict';

  application
    .filter('reverse', function() {
	  return function(items) {
		  if (items) {
			  return items.slice().reverse();
		  } else {
			  return items;
		  }
	  };
	})
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
              return input.format('dddd[, ]DD.MM.YYYY[, ]HH:mm:ss[ Uhr]');
            case 'day' :
              return input.format('dddd[, ]DD.MM.');
            case 'short-day' :
              return input.format('dd[., ]DD.MM.');
            case 'time' :
              return input.format('HH:mm [ Uhr]');
            default:
              return input.format('DD.MM.YYYY');
          }
        }
        return input;
      };
    }])
    .filter('jsonParse', function () {
      return function (input) {
        return JSON.parse(input);
      };
    })
    ;
};
