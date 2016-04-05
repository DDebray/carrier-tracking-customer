module.exports = ['$routeParams', 'CommonRequest', 'CommonMoment', function($routeParams, CommonRequest, CommonMoment) {
  'use strict';
  var self = this;

  self.test = 'tracking';
  self.trackingId = 'CO-1000200';
  self.data = null;

  self.getStatus = function () {
    CommonRequest.tracking.getStatus({
      trackingId: self.trackingId
    }, function(response) {
      if (response && response.content && response.content.result) {
        self.data = response.content.result;

        self.data.events.map(function (event) {
          event.moment = CommonMoment(event.timestamp);
        });
        console.log('Tracking data: ', self.data);

      } else {
        self.data = null;
      }
    }, function(response) {
      self.data = null;
    });
  };

  var trackingId = $routeParams.trackingId;

  console.log('trackingId', trackingId);

}];
