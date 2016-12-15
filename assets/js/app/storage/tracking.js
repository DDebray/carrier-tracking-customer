module.exports = [
  '$routeParams', '$location', 'CommonRequest', 'CommonMoment',
  function (
    $routeParams, $location, CommonRequest, CommonMoment
  ) {

    'use strict';
    var self = this;

    self.trackingId = null;
    self.data = null;

    self.track = function ( trackingId, cb, cbErr ) {
      // if (trackingId.indexOf('CO-') > -1 || trackingId.indexOf('CA-') > -1) {

      CommonRequest.tracking.getStatus( {
        trackingId: trackingId
      }, function ( response ) {
        if ( response && response.content && response.content.result ) {
          self.data = response.content.result;

          self.data.events.map( function ( event ) {
            event.moment = CommonMoment( event.timestamp );
          } );

          addCustomEvents();

          if ( cb ) {
            cb( self.data );
          }
        } else {
          self.data = null;
          if ( cbErr ) {
            cbErr( response );
          }
        }
      }, function ( response ) {
        self.data = null;
        if ( cbErr ) {
          cbErr( response );
        }
      } );
    };

    /**
     * @private
     * @function addCustomEvents
     * @description This method checks all cases that require custom events and than adds those events.
     */
    var addCustomEvents = function () {
      if ( self.data === null || self.data.events === null || self.data.route_information === null ) {
        return;
      }

      /* GLS */
      if ( checkCase( 'GLS_DE', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'GLS_DE', 1 ) );
      }
      if ( checkCase( 'GLS_FR', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'GLS_FR', 1 ) );
      }
      if ( checkCase( 'GLS_ES', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'GLS_ES', 1 ) );
      }
      if ( checkCase( 'GLS_FR', 2 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'GLS_FR', 2 ) );
      }
      if ( checkCase( 'GLS_ES', 2 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'GLS_ES', 2 ) );
      }

      /* USPS */
      if ( checkCase( 'USPS', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'USPS', 1 ) );
      }
      if ( checkCase( 'USPS', 2 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'USPS', 2 ) );
      }

      /* DHL */
      if ( checkCase( 'DHL', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'DHL', 1 ) );
      }
      if ( checkCase( 'DHL', 2 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'DHL', 2 ) );
      }
    };

    /**
     * @private
     * @function checkCase
     * @description This function determines if we need a custom event.
     *              It checks if the route, stated by the route_number, is processed by the carrier we reference with the carrier key.
     * @returns {Boolean} if we a custom event is needed
     * @param {String} carrierKey A key used to reference carrier information in the specialCarrierCases object.
     * @param {Number} route_number A number referencing a route in the route information stack.
     */
    var checkCase = function ( carrierKey, route_number ) {
      if ( route_number > self.data.route_information.length ) {
        return false;
      }
      var carrierCaseApplies = specialCarrierCases[ carrierKey ].service_codes.indexOf( self.data.route_information[ route_number - 1 ].service_code ) > -1,
        precedingCarrierDelivered = ( route_number > 1 ) ? self.data.route_information[ route_number - 2 ].status === 'DELIVERED' : true;

      return carrierCaseApplies && precedingCarrierDelivered;
    };

    /**
     * @private
     * @function customEventForCarrierOnRoute
     * @description This function bundles all custom event information.
     * @returns {Object} the new event data
     * @param {String} carrierKey A key used to reference carrier information in the specialCarrierCases object.
     * @param {Number} route_number A number referencing a route in the route information stack.
     */
    var customEventForCarrierOnRoute = function ( carrierKey, route_number ) {
      return {
        carrier: {
          code: specialCarrierCases[ carrierKey ].carrier_code,
          tracking_number: self.data.route_information[ route_number - 1 ].carrier_tracking_number
        },
        carrier_tracking_link: specialCarrierCases[ carrierKey ].tracking_link + self.data.route_information[ route_number - 1 ].carrier_tracking_number,
        description: 'HANDOVER_TO_' + carrierKey,
        timestamp: 'Keine Zeitangaben',
        status: 'IN_DELIVERY',
        route_number: route_number
      };
    };

    /**
     * @private
     * @property specialCarrierCases
     * @type {Object}
     *
     * @description This property is an object, that defines all carriers that need custom events.
     *              The carrier information are grouped in objects that can be accessed with given carrier keys.
     */
    var specialCarrierCases = {
      GLS_DE: {
        carrier_code: 'gls',
        service_codes: [ 'gls_de_pickup',
          'gls_de_dropoff'
        ],
        tracking_link: 'https://gls-group.eu/DE/de/paketverfolgung?match='
      },
      GLS_FR: {
        carrier_code: 'gls',
        service_codes: [ 'gls_fr_dpd_pickup',
          'gls_fr_dhl_dropoff',
          'gls_fr_hermes_pickup',
          'gls_fr_national',
          'gls_fr_ups_express_pickup'
        ],
        tracking_link: 'https://gls-group.eu/FR/fr/suivi-colis?match='
      },
      GLS_ES: {
        carrier_code: 'gls',
        service_codes: [ 'gls_es_dpd_pickup',
          'gls_es_national',
          'gls_es_dhl_dropoff',
          'gls_es_hermes_pickup'
        ],
        tracking_link: 'https://gls-group.eu/ES/es/seguimiento-de-envios?match='
      },
      USPS: {
        carrier_code: 'usps',
        service_codes: [ 'des_usps_dhl_dropoff',
          'des_usps_dpd_pickup',
          'des_usps_hermes_pickup',
          'des_usps_national'
        ],
        tracking_link: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1='
      },
      DHL: {
        carrier_code: 'dhl',
        service_codes: [ 'des_dhl_dhl_dropoff',
          'des_dhl_dpd_pickup',
          'des_dhl_hermes_pickup',
          'des_dhl_national'
        ],
        tracking_link: 'no'
      }
    };

    return self;
  }
];
