module.exports = [
  '$routeParams', '$location', '$filter', 'CommonRequest', 'CommonMoment', 'CommonTracking', 'StorageTracking', 'CommonUi',
function(
  $routeParams, $location, $filter, CommonRequest, CommonMoment, CommonTracking, StorageTracking, CommonUi
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
      tooltip: 'LABEL_PRINTED',
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
      tooltip: 'IN_TRANSIT',
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
      tooltip: 'HANDOVER_WAREHOUSE',
      angle : 'angle-right',
      icon : function () {
        return 'arrows-alt';
      },
      isActive : function () {
        return self.state > 2 && self.state < 7;
      },
      showCheckmark : function () {
        return self.state > 2 && self.state < 7;
      }
    },
    {
      tooltip: 'DELIVERED',
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
      tooltip: 'SUCCESS',
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
          self.state = self.availableStates.indexOf(response.events[response.events.length - 1].status);
          // self.showError = self.errorStates.indexOf(response.events[response.events.length - 1].status) !== -1;
          self.showError = response.events[response.events.length - 1].status === 'NOT_AVAILABLE';
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
      $location.path('/tracking/'+ self.trackingId);
    }
  };

  self.banner = {
    title : $filter('translate')('SECTION.FOOTER.TITLE'),
    subtitle : $filter('translate')('SECTION.FOOTER.SUBTITLE'),
    trackingId: self.trackingId
  };
}];
