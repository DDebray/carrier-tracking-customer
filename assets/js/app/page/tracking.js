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
  self.states = ['NOT_AVAILABLE', 'LABEL_PRINTED', 'IN_TRANSIT', 'HANDOVER', 'WAREHOUSE', 'DELIVERY_FAILED', 'DELIVERED', 'CANCELLED'];
  self.errorStates = ['NOT_AVAILABLE', /*'DELIVERY_FAILED',*/ 'CANCELLED'];
  // self.state = -1;
  self.state = 4;

  self.packageStates = [
    {
      icon: 'cube',
      activeCondition: function () {
        return self.state > 1;
      },
      success : function () {
        return self.state > 1;
      },
    },
    {
      icon: 'truck',
      iconModifier : 'fa-flip-horizontal',
      angle: 'fa-angle-right',
      isAngleVisible: function () {
        return self.state > 2;
      },
      isStateActive: function () {
        return self.state > 2;
      },
      success : function () {
        return self.state > 2;
      },
      error : function () {
        return self.state > 2;
      }
    },
    {
      icon: 'arrows-alt',
      angle: 'fa-angle-right',
      isAngleVisible: function () {
        return self.state > 3;
      },
      activeCondition: function () {
        return self.state > 3;
      },
      success : function () {
        return self.state > 3;
      },
    },
    {
      icon: 'home',
      angle: 'fa-angle-right',
      isAngleVisible: function () {
        return self.state > 4;
      },
      activeCondition: function () {
        return self.state > 4;
      },
      success : function () {
        return self.state > 4;
      },
    },
    {
      icon: 'check',
      angle: 'fa-angle-right',
      isAngleVisible: function () {
        return self.state > 5;
      },
      activeCondition: function () {
        return self.state > 5;
      },
      success : function () {
        return self.state > 5;
      },
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

      if (response && response.coureon_tracking_status) {
        self.state = self.states.indexOf(response.coureon_tracking_status);
        self.showError = response.coureon_tracking_status === 'NOT_AVAILABLE';
      }

      if (tracking.data.events.length === 0) {
        self.showError = true;
      }

      if (response.coureon_tracking_status === 'NOT_AVAILABLE' || tracking.data.events.length > 0) {
        self.showError = false;
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
