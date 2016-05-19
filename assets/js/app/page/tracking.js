module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment', 'CommonTracking', 'StorageTracking', 'CommonUi',
function(
  $routeParams, $location, CommonRequest, CommonMoment, CommonTracking, StorageTracking, CommonUi
) {
  'use strict';
  var self = this;

  self.trackingId = StorageTracking.trackingId || '';
  self.data = StorageTracking.data;
  self.showError = false;
  self.states = ['NOT_AVAILABLE', 'IN_TRANSIT', 'HANDOVER', 'WAREHOUSE', 'DELIVERY_FAILED', 'DELIVERED', 'CANCELLED'];
  self.state = -1;

  // get trackingId from URL
  if ($routeParams.trackingId) {
    self.trackingId = $routeParams.trackingId;
    StorageTracking.trackingId = self.trackingId;
  }

  if (self.trackingId) {
    StorageTracking.track(self.trackingId, function (response) {
      self.data = response;
      self.showError = false;

      if (response && response.coureon_tracking_status) {
        self.state = self.states.indexOf(response.coureon_tracking_status);
        self.showError = response.coureon_tracking_status === 'NOT_AVAILABLE';
      }

    }, function (error) {
      self.data = null;
      self.showError = true;
      self.state = -1;
    });
  }

  self.getStatus = function () {
    if (self.trackingId) {
      CommonTracking.addEvent('track', '"Jetzt Sendung verfolgen" button was used for "' + self.trackingId + '".' );
      $location.path('/tracking/'+ self.trackingId);
    }
  };
}];
