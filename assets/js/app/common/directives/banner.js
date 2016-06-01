module.exports = function() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      title: '@title',
      subtitle: '@subtitle'
    },
    transclude: true,
    replace: true,
    templateUrl: '/views/partials/banner.html'
  };
};
