module.exports = function() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      title: '@title',
      image: '@image'
    },
    transclude: true,
    replace: true,
    templateUrl: '/views/partials/hero.html'
  };
};
