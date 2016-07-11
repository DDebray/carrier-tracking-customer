module.exports = [
  '$rootScope', '$location', '$route', '$translate', '$filter', 'CommonUi', 'CommonConfig', 'CommonTracking',
function(
  $rootScope, $location, $route, $translate, $filter, CommonUi, CommonConfig, CommonTracking
) {
  'use strict';
  var self = this;

  self.viewLocked = function() {
    return !!CommonUi.modal.template;
  };

  CommonTracking.init();

  $rootScope.$on('$locationChangeSuccess', function () {
    if ($route && $route.current && $route.current.originalPath) {
      CommonTracking.addEvent('page', $route.current.originalPath);
    }
  });

  self.printReturnLabel = function (trackingId) {
    CommonTracking.addEvent('track', 'print-return-label-button was clicked.' );
    if (trackingId) {
      $location.path('/printing/' + trackingId);
    }
  };

  self.printLabel = function () {
    CommonTracking.addEvent('track', 'print-label-button was clicked.' );
  };

  self.banner = {
    title : $filter('translate')('SECTION.FOOTER.TITLE'),
    subtitle : $filter('translate')('SECTION.FOOTER.SUBTITLE')
  };

  self.env = CommonConfig.environment();
}];
