module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment',
function(
  $routeParams, $location, CommonRequest, CommonMoment
) {

  'use strict';
  var self = this;

  self.trackingId = null;
  self.data = null;

  // // get trackingId from URL (initially)
  // if ($routeParams.trackingId) {
  //   console.log('$routeParams.trackingId exists: ', $routeParams.trackingId);
  //   self.trackingId = $routeParams.trackingId;
  // }

  self.track = function(trackingId, cb, cbErr) {
    CommonRequest.tracking.getStatus({
      trackingId : trackingId
    }, function(response) {
      console.log('response', response);
      if (response && response.content && response.content.result) {
        self.data = response.content.result;

        self.data.events.map(function (event) {
          event.moment = CommonMoment(event.timestamp);
        });
        console.log('Tracking data: ', self.data);

        if (cb) {
          cb(self.data);
        }
      } else {
        self.data = null;
        if (cbErr) {
          cbErr(response);
        }
      }
    }, function(response) {
      self.data = null;
      if (cbErr) {
        cbErr(response);
      }
    });

    // self.track(self.trackingId);

    // console.log('$location.path()', $location.path());
    // console.log('$location.path().indexOf', $location.path().indexOf('tracking/'));
    //
    // if (self.trackingId && $location.path().indexOf('tracking/') === -1) {
    //   console.log('self.trackingId exists', self.trackingId);
    //
    //   $location.path('/tracking/'+ self.trackingId);
    //   $location.replace();
    // }
  };

  return self;
}];
