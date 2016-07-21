module.exports = function() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      bannerTitle: '@bannerTitle',
      bannerSubtitle: '@bannerSubtitle',
      trackingId: '@trackingId'
    },
    transclude: true,
    replace: true,
    templateUrl: '/views/partials/banner.html'
  };
};
