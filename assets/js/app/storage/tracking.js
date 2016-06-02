module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment',
function(
  $routeParams, $location, CommonRequest, CommonMoment
) {

  'use strict';
  var self = this;

  self.trackingId = null;
  self.data = null;

  self.track = function(trackingId, cb, cbErr) {
    // if (trackingId.indexOf('CO-') > -1 || trackingId.indexOf('CA-') > -1) {

    CommonRequest.tracking.getStatus({
      trackingId : trackingId
    }, function(response) {
      if (response && response.content && response.content.result) {
        self.data = response.content.result;

        self.data.events.map(function (event) {
          event.moment = CommonMoment(event.timestamp);
        });

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

  //   } else {
  //
  //     CommonRequest.externalTracking.getStatus({
  //       trackingId : trackingId
  //     }, function(response) {
  //       if (response && response.content && response.content.result) {
  //         self.data = response.content.result;
  //
  //         self.data.events.map(function (event) {
  //           event.moment = CommonMoment(event.timestamp);
  //         });
  //
  //         if (cb) {
  //           cb(self.data);
  //         }
  //       } else {
  //         self.data = null;
  //         if (cbErr) {
  //           cbErr(response);
  //         }
  //       }
  //     }, function(response) {
  //       self.data = null;
  //       if (cbErr) {
  //         cbErr(response);
  //       }
  //     });
  //
  //   }
  };

  return self;
}];
