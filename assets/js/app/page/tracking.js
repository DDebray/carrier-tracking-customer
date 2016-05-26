module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment', 'CommonTracking', 'StorageTracking', 'CommonUi',
function(
  $routeParams, $location, CommonRequest, CommonMoment, CommonTracking, StorageTracking, CommonUi
) {
  'use strict';
  var self = this;

  self.data = StorageTracking.data;
  self.trackingId = StorageTracking.trackingId || '';
  self.availableStates = ['NOT_AVAILABLE', 'LABEL_PRINTED', 'IN_TRANSIT', 'HANDOVER', 'WAREHOUSE', 'DELIVERY_FAILED', 'DELIVERED', 'CANCELLED'];
  // self.errorStates = ['NOT_AVAILABLE', 'CANCELLED'];
  self.showError = false;
  self.state = -1;

// IN_TRANSIT.FORWARD.DISTRIBUTION_CENTER
// HANDOVER.CARRIER.LOCATION
// WAREHOUSE
// NOT_AVAILABLE.RECEIVER.NEW_DELIVERY_ATTEMPT



  self.packageStates = [
    {
      icon : function () {
        return 'cube';
      },
      isActive : function () {
        return self.state > 0;
      },
      showCheckmark : function () {
        return self.state > 0;
      },
      showCross : function () {
        return self.state === 7;
      }
    },
    {
      angle : 'angle-right',
      iconModifier : 'fa-flip-horizontal',
      icon : function () {
        return 'truck';
      },
      isActive : function () {
        return self.state > 1 && self.state < 7;
      },
      showCheckmark : function () {
        return self.state > 1 && self.state < 7;
      }
    },
    {
      angle : 'angle-right',
      icon : function () {
        return 'arrows-alt';
      },
      isActive : function () {
        return self.state > 4 && self.state < 7;
      },
      showCheckmark : function () {
        return self.state > 4 && self.state < 7;
      }
    },
    {
      angle : 'angle-right',
      icon : function () {
        return 'home';
      },
      isActive : function () {
        return self.state >= 5 && self.state < 7;
      },
      showCheckmark : function () {
        return self.state > 5 && self.state < 7;
      },
      showCross : function () {
        return self.state === 5 && self.state < 7;
      }
    },
    {
      angle : 'angle-right',
      icon : function () {
        return self.state === 7 && false ? 'close' : 'check';
      },
      isActive : function () {
        return self.state === 6;
      },
      showCheckmark : function () {
        return false;
      }
    }
  ];

  // get trackingId from URL
  if ($routeParams.trackingId) {
    self.trackingId = $routeParams.trackingId;
    StorageTracking.trackingId = self.trackingId;
  }

  if (self.trackingId) {
    StorageTracking.track(self.trackingId, function (response) {
      self.data = response;

      if (response && response.events) {
        if (!!response.events.length) {
          self.state = self.availableStates.indexOf(response.events[response.events.length - 1].coureon_tracking_status);
          // self.showError = self.errorStates.indexOf(response.events[response.events.length - 1].coureon_tracking_status) !== -1;
          self.showError = response.events[response.events.length - 1].coureon_tracking_status === 'NOT_AVAILABLE';
        } else {
          self.showError = true;
        }
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
      $location.path('/'+ self.trackingId);
    }
  };
}];
