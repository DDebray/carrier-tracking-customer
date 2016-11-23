module.exports = [
  '$routeParams', '$location', '$filter', 'CommonRequest', 'CommonMoment', 'CommonTracking', 'StorageTracking', 'CommonUi',
  function (
    $routeParams, $location, $filter, CommonRequest, CommonMoment, CommonTracking, StorageTracking, CommonUi
  ) {
    'use strict';
    var self = this;

    self.data = StorageTracking.data;
    self.trackingId = StorageTracking.trackingId || '';
    self.availableStates = [
      'LABEL_PRINTED',
      'IN_TRANSIT',
      'HANDOVER',
      'WAREHOUSE',
      'IN_DELIVERY',
      'DELIVERED'
    ];
    self.availableErrorStates = [
      'CANCELLED',
      'NO_HANDOVER',
      'DELIVERY_FAILED',
      'RECEIVER_MOVED'
    ];
    self.showError = false;
    self.state = -1;
    self.errorState = -1;
    self.carrierInfo = null;

    // IN_TRANSIT.FORWARD.DISTRIBUTION_CENTER
    // HANDOVER.CARRIER.LOCATION
    // WAREHOUSE
    // NOT_AVAILABLE.RECEIVER.NEW_DELIVERY_ATTEMPT

    self.packageStates = [ {
      tooltip: 'LABEL_PRINTED',
      icon: function () {
        return 'cube';
      },
      isActive: function () {
        return self.state >= 0 || self.errorState > 0;
      },
      showCheckmark: function () {
        return self.state >= 0;
      },
      showCross: function () {
        return self.errorState === 0;
      }
    }, {
      tooltip: 'IN_TRANSIT',
      angle: 'angle-right',
      iconModifier: 'fa-flip-horizontal',
      icon: function () {
        return 'truck';
      },
      isActive: function () {
        return self.state > 0 || self.errorState > 0;
      },
      showCheckmark: function () {
        return self.state > 0;
      }
    }, {
      tooltip: 'HANDOVER_WAREHOUSE',
      angle: 'angle-right',
      icon: function () {
        return 'arrows-alt';
      },
      isActive: function () {
        return self.state > 1 || self.errorState > 1;
      },
      showCheckmark: function () {
        return self.state > 1;
      },
      showCross: function () {
        return self.errorState === 1;
      }
    }, {
      tooltip: 'IN_DELIVERY',
      angle: 'angle-right',
      icon: function () {
        return 'home';
      },
      isActive: function () {
        return self.state > 3;
      },
      showCheckmark: function () {
        return self.state > 3;
      },
      showCross: function () {
        return self.errorState > 1;
      }
    }, {
      tooltip: 'DELIVERED',
      angle: 'angle-right',
      icon: function () {
        return self.state === 5 && false ? 'close' : 'check';
      },
      isActive: function () {
        return self.state === 5;
      },
      showCheckmark: function () {
        return false;
      }
    } ];

    var getCarrierInfoByEvents = function ( events ) {
      // used to test multiple carriers
      // events.push({
      //   carrier: {
      //     code: 'hermes'
      //   }
      // });
      // events.push({
      //   carrier: {
      //     code: 'gls'
      //   }
      // });

      var uniqueBy = function ( a, key ) {
        var seen = {};
        return a.filter( function ( item ) {
          var k = key( item );
          return seen.hasOwnProperty( k ) ? false : ( seen[ k ] = true );
        } );
      };

      // create an array that only contains all the carriers from the events
      var unfilteredCarriers = events.map( function ( event ) {
        return event.carrier;
      } );

      // filter dublicates
      return uniqueBy( unfilteredCarriers, JSON.stringify );
    };

    // get trackingId from URL
    if ( $routeParams.trackingId ) {
      self.trackingId = $routeParams.trackingId;
      StorageTracking.trackingId = self.trackingId;
    }

    if ( self.trackingId ) {
      StorageTracking.track( self.trackingId, function ( response ) {
          self.data = response;

          self.data.events.push( Object.create( self.data.events[ 0 ] ) );
          self.data.events.push( Object.create( self.data.events[ 0 ] ) );
          self.data.events.push( Object.create( self.data.events[ 0 ] ) );
          self.data.events.push( Object.create( self.data.events[ 0 ] ) );
          self.data.events.push( Object.create( self.data.events[ 0 ] ) );

          console.log( self.data.events );

          self.showError = response.status === 'NOT_AVAILABLE';

          if ( response && response.events && !!response.events.length ) {
            self.state = self.availableStates.indexOf( response.status );
            self.errorState = self.availableErrorStates.indexOf( response.status );
            self.carrierInfo = getCarrierInfoByEvents( response.events );
          } else {
            self.showError = true;
          }
        },
        function ( error ) {
          self.data = null;
          self.showError = true;
          self.state = -1;
        } );
    }

    self.getStatus = function () {
      if ( self.trackingId ) {
        CommonTracking.addEvent( 'track', '"Jetzt Sendung verfolgen" button was used for "' + self.trackingId + '".' );
        $location.path( '/tracking/' + self.trackingId );
      }
    };

    self.isCurrentActiveEvent = function ( event ) {
      var lastEvent = self.data.events[ self.data.events.length - 1 ];
      return lastEvent === event;
    }

    self.banner = {
      title: $filter( 'translate' )( 'SECTION.FOOTER.TITLE' ),
      subtitle: $filter( 'translate' )( 'SECTION.FOOTER.SUBTITLE' ),
      trackingId: self.trackingId
    };
  }
];
