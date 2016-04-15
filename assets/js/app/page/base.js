module.exports = [
  '$rootScope', '$location', '$route', 'CommonUi', 'CommonTracking',
function(
  $rootScope, $location, $route, CommonUi, CommonTracking
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
}];
