module.exports = [
  '$rootScope', '$location', '$route', '$translate', 'CommonUi', 'CommonConfig', 'CommonTracking',
function(
  $rootScope, $location, $route, $translate, CommonUi, CommonConfig, CommonTracking
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

  self.printReturnLabel = function () {
    CommonTracking.addEvent('track', 'print-return-label-button was clicked.' );
  };

  self.printLabel = function () {
    CommonTracking.addEvent('track', 'print-label-button was clicked.' );
  };

  self.env = CommonConfig.environment();
}];
