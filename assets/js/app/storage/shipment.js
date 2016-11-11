/**
 * #StorageShipment
 * This module describes a shipment object.
 * The values match the shiphment resource values.
 * To get the resource from the API the CommonRequest module is used here.
 */
module.exports = [
  /**
   * ## Dependencies
   * - CommonRequest
   */
  'CommonRequest',
  function (
    CommonRequest
  ) {
    'use strict';

    /**
     * ##Properties
     */

    /**
     * This __private__ object holds the reference to this object.
     */
    var self = this,

      /**
       * This __private__ object holds the possible request parameters.
       */
      requestParameters = {
        tracking_number: null,
        postal_code_for_verification: null,
        address_from: null,
        address_to: null
      };

    /**
     * This __public__ object holds the shipment addresses data.
     */
    self.addresses = {};

    /**
     * This __public__ object holds the shipment rates.
     */
    self.rates = null;

    /**
     * This __public__ object holds the possible error that may comes with the request.
     */
    self.error = false;

    /**
     * This __public__ object holds the possible notification that may come with the request.
     */
    self.notifications = false;

    /**
     * ##Functions
     */

    /**
     * This __public__ function semantically creates a new shipment resource out of a tracking number.
     * This will be the return shipment for the original shipment associated to that tracking number.
     * It needs the postal code so the server can check for the access permission.
     * @param  {String} trackingId a string holding the tracking number.
     * @param  {String} postalCodeForVerification a string holding the postal code for verification
     */
    self.createResource = function ( trackingId, postalCodeForVerification ) {
      requestParameters.tracking_number = trackingId;
      requestParameters.postal_code_for_verification = postalCodeForVerification;

      doRequest();
    };

    /**
     * This __public__ function semantically updates the shipment resource.
     * It gets the new sender address and asks the server for a new shipment
     * because some rates prices also depend on the addresses.
     * @param  {Object} sender an address object for the sender
     */
    self.updateResource = function ( sender ) {
      requestParameters.address_from = sender;

      doRequest();
    };

    /**
     * This __private__ function does the resource request.
     * It uses the request parameters saved in requestParameters.
     * This method can only be used in the storage shipment module.
     */
    var doRequest = function () {
      CommonRequest.shipment.create( {
        parameters: requestParameters
      }, function ( response ) {
        if ( response && response.status === 'ERROR' ) {
          self.notifications = ( response.messages.length > 0 ) ? response.messages : false;
        }
        if ( response && response.content ) {
          self.notifications = ( response.messages.length > 0 ) ? response.messages : false;
          fillAddresses( response.content.result.address_from, response.content.result.address_to );
          fillRates( response.content.result.rates );
        }
      }, function ( error ) {
        self.error = error;
      } );
    };

    /**
     * This __private__ function fills the global addresses object with the sender and receiver address information.
     * It adds some extra configuration to the addresses.
     * This method can only be used in the storage shipment module.
     * @param  {Object} sender   an address object for the sender
     * @param  {Object} receiver an address object for the receiver
     */
    var fillAddresses = function ( sender, receiver ) {
      self.addresses.RECEIVER_ADDRESS = receiver;
      self.addresses.RECEIVER_ADDRESS.is_editable = false;
      self.addresses.RECEIVER_ADDRESS.address_type = 'RECEIVER_ADDRESS';

      self.addresses.SENDER_ADDRESS = sender;
      self.addresses.SENDER_ADDRESS.is_editable = true;
      self.addresses.SENDER_ADDRESS.address_type = 'SENDER_ADDRESS';
    };

    /**
     * This __private__ function fills the global rates object with the rates information.
     * This method can only be used in the storage shipment module.
     * @param  {Object} rates an object holding the rates information
     */
    var fillRates = function ( rates ) {
      self.rates = rates;
    };

    return self;
  }
];
