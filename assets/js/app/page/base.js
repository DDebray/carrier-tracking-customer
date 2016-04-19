module.exports = [
  '$rootScope', '$location', '$route', '$translate', 'CommonUi', 'CommonTracking', 'CommonConfig',
function(
  $rootScope, $location, $route, $translate, CommonUi, CommonTracking, CommonConfig
) {
  'use strict';
  var self = this;

  self.viewLocked = function() {
    return !!CommonUi.modal.template;
  };

  CommonTracking.init();

  $rootScope.$on('$locationChangeSuccess', function () {
    // HINT: Use this if different routes should have different titles
    //
    // document.title = 'Coureon Tracking';
    // if ($route.current.title) {
    //   $translate($route.current.title).then(function(translation) {
    //     document.title = 'Coureon - ' + translation.replace('%%', '');
    //   });
    // }

    if ($route && $route.current && $route.current.originalPath) {
      CommonTracking.addEvent('page', $route.current.originalPath);
    }
  });

  var notFoundModalUrl = '/views/partials/no_content.html';
  self.printReturnLabel = function () {
    CommonTracking.addEvent('track', 'print-return-label-button was clicked.' );
    CommonUi.modal.show(notFoundModalUrl, true, { data : 'test123' });
  };

  self.printLabel = function () {
    CommonTracking.addEvent('track', 'print-label-button was clicked.' );
    CommonUi.modal.show(notFoundModalUrl, true, { data : 'test123' });
  };

  self.myAccountUrl = CommonConfig.endpoints.app[CommonConfig.environment()];
  self.coureonUrl = CommonConfig.endpoints.www[CommonConfig.environment()];
}];
