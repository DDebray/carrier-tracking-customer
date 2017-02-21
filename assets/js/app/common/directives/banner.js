module.exports = function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      bannerTitle: '@bannerTitle',
      bannerSubtitle: '@bannerSubtitle',
      trackingId: '@trackingId',
      bannerLink: '@bannerLink',
      hideBannerLink: '@hideBannerLink'
    },
    transclude: true,
    replace: true,
    templateUrl: '/views/partials/banner.html'
  };
};
