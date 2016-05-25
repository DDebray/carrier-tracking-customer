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
  self.errorStates = ['NOT_AVAILABLE', /*'DELIVERY_FAILED',*/ 'CANCELLED'];
  self.states = ['NOT_AVAILABLE', 'LABEL_PRINTED', 'IN_TRANSIT', 'HANDOVER', 'WAREHOUSE', 'DELIVERY_FAILED', 'DELIVERED', 'CANCELLED'];
  self.state = -1;

  self.packageStates = [
    {
      icon : function () {
        return 'cube';
      },
      isActive : function () {
        return self.state > 0;
      },
      success : function () {
        return self.state > 0;
      },
      error : function () {
        return self.state === 7;
      }
    },
    {
      icon : function () {
        return 'truck';
      },
      iconModifier : 'fa-flip-horizontal',
      angle : 'angle-right',
      isActive : function () {
        return self.state > 1 && self.state < 7;
      },
      success : function () {
        return self.state > 1 && self.state < 7;
      }
    },
    {
      icon : function () {
        return 'arrows-alt';
      },
      angle : 'angle-right',
      isActive : function () {
        return self.state > 4 && self.state < 7;
      },
      success : function () {
        return self.state > 4 && self.state < 7;
      }
    },
    {
      icon : function () {
        return 'home';
      },
      angle : 'angle-right',
      isActive : function () {
        return self.state >= 5 && self.state < 7;
      },
      success : function () {
        return self.state > 5 && self.state < 7;
      },
      error : function () {
        return self.state === 5 && self.state < 7;
      }
    },
    {
      icon : function () {
        return self.state === 7 && false ? 'close' : 'check';
      },
      angle : 'angle-right',
      isActive : function () {
        return self.state === 6;
      },
      success : function () {
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
          self.state = self.states.indexOf(response.events[response.events.length - 1].coureon_tracking_status);
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
