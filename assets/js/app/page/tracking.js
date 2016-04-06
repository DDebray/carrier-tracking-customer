module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment', 'StorageTracking',
function(
  $routeParams, $location, CommonRequest, CommonMoment, StorageTracking
) {
  'use strict';
  var self = this;

  self.trackingId = StorageTracking.trackingId || '';
  self.data = StorageTracking.data;
  self.showError = false;

  // get trackingId from URL
  if ($routeParams.trackingId) {
    console.log('$routeParams.trackingId exists: ', $routeParams.trackingId);
    self.trackingId = $routeParams.trackingId;
    StorageTracking.trackingId = self.trackingId;
  }

  if (self.trackingId) {
    StorageTracking.track(self.trackingId, function (response) {
      console.log('success response', response);
      self.data = response;
      self.showError = false;
    }, function (error) {
      console.log('error response', error);
      self.data = null;
      self.showError = true;
    });
  }

  self.getStatus = function () {
    // CommonRequest.tracking.getStatus({
    //   trackingId: self.trackingId
    // }, function(response) {
    //   if (response && response.content && response.content.result) {
    //     self.data = response.content.result;
    //
    //     self.data.events.map(function (event) {
    //       event.moment = CommonMoment(event.timestamp);
    //     });
    //     console.log('Tracking data: ', self.data);
    //
    //   } else {
    //     self.data = null;
    //   }
    // }, function(response) {
    //   self.data = null;
    // });



    // console.log('$location.path()', $location.path());
    // console.log('$location.path().indexOf', $location.path().indexOf('tracking/'));

    if (self.trackingId) {
      console.log('self.trackingId exists', self.trackingId);

      $location.path('/'+ self.trackingId);
      // $location.replace();
    }
  };



}];
