module.exports = function() {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      rate: '&carrierLogo',
      useDimensions: '&useDimensions',
    },
    templateUrl: '/views/partials/carrier_logo.html',
    link: function(scope) {
      var carrierLinks = {
        myhermes : 'hermes',
        gel : 'gelexpress',
        ccl : 'cclogistics'
      },
      validCarriers = [
        'amazon',
        'dhl',
        'dpag',
        'dpd',
        'hermes',
        'nexive',
        'ups',
        'gelexpress',
        'cclogistics',
        'btg',
        'sovereign',
        'ijs',
        'boxberry',
        'borderguru',
        'atpost',
        'gls',
        'yodel'
      ];

      var rateCode = (scope.rate() || {}).code || '';

      /*rateCode = [validCarriers[Math.round((Math.random() * (validCarriers.length - 1)))]];
      if (!!Math.round(Math.random())) {
        rateCode.push(validCarriers[Math.round((Math.random() * (validCarriers.length - 1)))]);
      }
      rateCode = rateCode.join('_');*/

      scope.useDimensions = scope.useDimensions();
      scope.carriers = rateCode.split('_').map(function(segment) {
        return carrierLinks[segment] || segment;
      }).filter(function(segment) {
        return validCarriers.indexOf(segment) !== -1;
      }).sort(function(prev, next) {
        return validCarriers.indexOf(prev) - validCarriers.indexOf(next);
      });
    }
  };
};
