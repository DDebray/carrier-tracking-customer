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
      CommonRequest.tracking.getStatus( {
        trackingId: trackingId
      }, function ( response ) {
        if ( response && response.content && response.content.result ) {
          self.data = response.content.result;

          self.data.events.map( function ( event ) {
            event.moment = CommonMoment( event.timestamp );
          } );

          addEvents();
          filterDuplicates();

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
     * @function addEvents
     * @description This method adds Events to the event list.
     */
    var addEvents = function () {
      if ( self.data === null || self.data.events === null || self.data.route_information === null ) {
        return;
      }

      // Custom event:
      addGLSCustomEvents();
      addUSPSCustomEvents();
      addDHLCustomEvents();

      // Placebo events:
      addWarehouseEvent();
    };

    /**
     * @private
     * @function addWarehouseEvent
     * @description This methods adds a placebo warehouse event.
     *              This event is temporary: 24 hours after first route completed and before next route starts.
     */
    var addWarehouseEvent = function () {
      if ( hasManyRoutes() && lastEventCompletesFirstRoute() && lastEventIs24HoursOld() ) {
        self.data.events.push( placeboWarehouseEvent() );
      }
    };

    /**
     * @private
     * @function placeboWarehouseEvent
     * @description This returns the event details for a warehouse event.
     */
    var placeboWarehouseEvent = function () {
      return {
        carrier: {
          code: 'coureon',
          tracking_number: self.data.id
        },
        moment: CommonMoment(),
        description: 'IN_TRANSIT.TO_DESTINATION_COUNTRY',
        route_number: 2
      };
    };

    /**
     * @private
     * @function hasManyRoutes
     * @description This checks if the tracking data contains more than one route.
     *              This should be when the shipment is a "Bundle".
     * @returns {Boolean} if number of routes is higher than one.
     */
    var hasManyRoutes = function () {
      return self.data.route_information && self.data.route_information.length > 1;
    };

    /**
     * @private
     * @function lastEventCompletesFirstRoute
     * @description This checks if the last event in the event list, is the "DELIVERED" event for the first mile.
     *              This event would complete the first mile.
     * @returns {Boolean} if event's related route is the first route and if it's status is DELIVERED.
     */
    var lastEventCompletesFirstRoute = function () {
      var numberOfEvents = ( self.data.events ) ? self.data.events.length : 0;
      var lastEvent = self.data.events[ numberOfEvents - 1 ];
      return lastEvent && lastEvent.route_number === 1 && lastEvent.status === 'DELIVERED';
    };

    /**
     * @private
     * @function lastEventIs24HoursOld
     * @description This checks if the last event is 24 hours old or older.
     * @returns {Boolean} if the past time is 24 hours or more.
     */
    var lastEventIs24HoursOld = function () {
      var numberOfEvents = ( self.data.events ) ? self.data.events.length : 0;
      var lastEvent = self.data.events[ numberOfEvents - 1 ];
      if ( lastEvent ) {
        var pastHours = CommonMoment().diff( lastEvent.moment, 'hours' );
        return pastHours >= 24;
      }
      return false;
    };

    /**
     * @private
     * @function addGLSCustomEvents
     * @description This adds custom events for the the carrier "GLS".
     */
    var addGLSCustomEvents = function () {
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
    };

    /**
     * @private
     * @function addGLSCustomEvents
     * @description This adds custom events for the the carrier "USPS".
     */
    var addUSPSCustomEvents = function () {
      if ( checkCase( 'USPS', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'USPS', 1 ) );
      }
      if ( checkCase( 'USPS', 3 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'USPS', 3 ) );
      }
    };

    /**
     * @private
     * @function addGLSCustomEvents
     * @description This adds custom events for the the carrier "DHL" (USA).
     */
    var addDHLCustomEvents = function () {
      if ( checkCase( 'DHL', 1 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'DHL', 1 ) );
      }
      if ( checkCase( 'DHL', 3 ) ) {
        self.data.events.push( customEventForCarrierOnRoute( 'DHL', 3 ) );
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
          'gls_fr_dpd_dropoff',
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
          'gls_es_dpd_dropoff',
          'gls_es_national',
          'gls_es_dhl_dropoff',
          'gls_es_hermes_pickup'
        ],
        tracking_link: 'https://gls-group.eu/ES/es/seguimiento-de-envios?match='
      },
      USPS: {
        carrier_code: 'usps',
        service_codes: [ 'usps_national' ],
        tracking_link: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1='
      },
      DHL: {
        carrier_code: 'dhl',
        service_codes: [ 'dhl_express_international_worldwide' ],
        tracking_link: 'https://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=en&idc='
      }
    };

    /**
     * @private
     * @function filterDuplicates
     * @description This filters all successive events with the same status.
     *              Only the last event with that status is left.
     * @returns {Array} the filtered list.
     */
    var filterDuplicates = function () {
      var filteredEvents = self.data.events.filter( function ( event, index, list ) {
        var lastIndex = list.length - 1;
        if ( index < lastIndex ) {
          return event.status !== list[ index + 1 ].status;
        }
        return true;
      } );

      self.data.events = filteredEvents;
    };

    return self;
  }
];
