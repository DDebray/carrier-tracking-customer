module.exports = function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      heroTitle: '@heroTitle',
      heroImage: '@heroImage',
      heroPosition: '@heroPosition'
    },
    transclude: true,
    replace: true,
    templateUrl: '/views/partials/hero.html'
  };
};
