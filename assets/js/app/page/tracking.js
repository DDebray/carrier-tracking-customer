module.exports = [
  '$routeParams', '$location', '$filter', 'CommonRequest', 'CommonMoment', 'CommonTracking', 'StorageTracking', 'CommonUi',
  function(
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
      icon: function() {
        return 'cube';
      },
      isActive: function() {
        return self.state >= 0 || self.errorState > 0;
      },
      showCheckmark: function() {
        return self.state >= 0;
      },
      showCross: function() {
        return self.errorState === 0;
      }
    }, {
      tooltip: 'IN_TRANSIT',
      angle: 'angle-right',
      iconModifier: 'fa-flip-horizontal',
      icon: function() {
        return 'truck';
      },
      isActive: function() {
        return self.state > 0 || self.errorState > 0;
      },
      showCheckmark: function() {
        return self.state > 0;
      }
    }, {
      tooltip: 'HANDOVER_WAREHOUSE',
      angle: 'angle-right',
      icon: function() {
        return 'arrows-alt';
      },
      isActive: function() {
        return self.state > 1 || self.errorState > 1;
      },
      showCheckmark: function() {
        return self.state > 1;
      },
      showCross: function() {
        return self.errorState === 1;
      }
    }, {
      tooltip: 'IN_DELIVERY',
      angle: 'angle-right',
      icon: function() {
        return 'home';
      },
      isActive: function() {
        return self.state > 3;
      },
      showCheckmark: function() {
        return self.state > 3;
      },
      showCross: function() {
        return self.errorState > 1;
      }
    }, {
      tooltip: 'DELIVERED',
      angle: 'angle-right',
      icon: function() {
        return self.state === 5 && false ? 'close' : 'check';
      },
      isActive: function() {
        return self.state === 5;
      },
      showCheckmark: function() {
        return false;
      }
    } ];

    var getCarrierInfoByEvents = function( events ) {
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

      var uniqueBy = function( a, key ) {
        var seen = {};
        return a.filter( function( item ) {
          var k = key( item );
          return seen.hasOwnProperty( k ) ? false : ( seen[ k ] = true );
        } );
      };

      // create an array that only contains all the carriers from the events
      var unfilteredCarriers = events.map( function( event ) {
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
      StorageTracking.track( self.trackingId, function( response ) {
        self.data = response;
        
        self.showError = response.status === 'NOT_AVAILABLE';
        
        if ( response && response.events && response.route_information ) {
          if ( !!response.events.length && response.route_information.length > 1 ) {
            self.state = self.availableStates.indexOf( response.status );
            self.errorState = self.availableErrorStates.indexOf( response.status );

            self.carrierInfo = getCarrierInfoByEvents( response.events );

            if ( response.route_information[ 0 ].status === 'DELIVERED' ) {
              if ( response.route_information[ 1 ].service_code === 'gls_fr_dpd_pickup' || response.route_information[ 1 ].service_code === 'gls_fr_dhl_dropoff' || response.route_information[ 1 ].service_code === 'gls_fr_hermes_pickup' || response.route_information[ 1 ].service_code === 'gls_fr_national' || response.route_information[ 1 ].service_code === 'gls_fr_ups_express_pickup') {
                self.data.events.push( {
                  carrier: {
                    code: 'gls'
                  },
                  carrier_tracking_link: 'https://gls-group.eu/FR/fr/suivi-colis?match=' + response.route_information[ 1 ].carrier_tracking_number,
                  description: 'HANDOVER_TO_GLS_FR',
                  timestamp: 'Keine Zeitangaben',
                  status: 'IN_DELIVERY'
                } );
              }
              if ( response.route_information[ 1 ].service_code === 'gls_es_dpd_pickup' || response.route_information[ 1 ].service_code === 'gls_es_national' || response.route_information[ 1 ].service_code === 'gls_es_dhl_dropoff' || response.route_information[ 1 ].service_code === 'gls_es_hermes_pickup') {
                self.data.events.push( {
                  carrier: {
                    code: 'gls'
                  },
                  carrier_tracking_link: 'https://gls-group.eu/ES/es/seguimiento-de-envios?match=' + response.route_information[ 1 ].carrier_tracking_number,
                  description: 'HANDOVER_TO_GLS_ES',
                  timestamp: 'Keine Zeitangaben',
                  status: 'IN_DELIVERY'
                } );
              }
            }
          } else {
            self.showError = true;
          }
        }
      }, function( error ) {
        self.data = null;
        self.showError = true;
        self.state = -1;
      } );
    }

    self.getStatus = function() {
      if ( self.trackingId ) {
        CommonTracking.addEvent( 'track', '"Jetzt Sendung verfolgen" button was used for "' + self.trackingId + '".' );
        $location.path( '/tracking/' + self.trackingId );
      }
    };

    self.banner = {
      title: $filter( 'translate' )( 'SECTION.FOOTER.TITLE' ),
      subtitle: $filter( 'translate' )( 'SECTION.FOOTER.SUBTITLE' ),
      trackingId: self.trackingId
    };
  }
];
