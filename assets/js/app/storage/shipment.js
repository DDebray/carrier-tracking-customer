module.exports = [
  'CommonRequest',
  function(
    CommonRequest
  ) {
    'use strict';

    var self = this;
    self.addresses = {};
    self.rates = null;

    /**
     * This method loads the return shipment for the orginal shipment associated with the given tracking number.
     * The shipment data are saved as global fields: addresses and rates.
     * @param  {string} trackingId The given tracking number.
     */
    self.load = function(trackingId) {

      var setAddresses = function(sender, receiver) {
        self.addresses.RECEIVER_ADDRESS = receiver;
        self.addresses.RECEIVER_ADDRESS.is_editable = false;
        self.addresses.RECEIVER_ADDRESS.address_type = 'RECEIVER_ADDRESS';

        self.addresses.SENDER_ADDRESS = sender;
        self.addresses.SENDER_ADDRESS.is_editable = true;
        self.addresses.SENDER_ADDRESS.address_type = 'SENDER_ADDRESS';
      };

      CommonRequest.shipment.get({
        trackingNumber: trackingId
      }, function(response) {
        if (response && response.content) {
          setAddresses(response.content.result.address_from, response.content.result.address_to);
          self.rates = response.content.result.rates;
        }
      });
    };

    /**
     * This function updates the shipment storage object when an address is changed.
     * @param  {object} address The new address information with the address_type.
     */
    self.update = function(address) {
      self.addresses[address.address_type] = address;
    };

    return self;
  }
];
