module.exports = [
  'CommonRequest', 'CommonUi',
  function(
    CommonRequest, CommonUi
  ) {
    'use strict';
    var self = this;

    self.items = null;

    var running = false,
      cbQueue = [];

    self.load = function(cb) {
      if (cb && self.items) {
        return cb(self.items);
      }

      if (cb) {
        cbQueue.push(cb);
      }

      if (running) {
        return;
      }

      running = true;

      CommonRequest.countries.get({}, function(response) {
        if (response && response.content) {
          self.items = response.content.countries;

          cbQueue.forEach(function(cb) {
            cb(self.items);
          });
        } else {
          CommonUi.notifications.throwError();
          running = false;
        }
      }, function() {
        CommonUi.notifications.throwError();
        running = false;
      });
    };

    return self;
  }
];
