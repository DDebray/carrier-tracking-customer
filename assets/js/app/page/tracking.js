module.exports = ['CommonRequest', function(CommonRequest) {
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
        console.log('response.content', response.content.result);
        self.data = response.content.result;
      } else {
        self.data = null;
      }
    }, function(response) {
      self.data = null;
    });
  };

}];
