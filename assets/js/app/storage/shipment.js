module.exports = [
  'CommonRequest',
  function(
    CommonRequest
  ) {
    'use strict';

    var self = this;
    self.rates = null;


    // Keep this field private in this factory!
    var receiver = {};
    var sender = {};

    self.addresses = {
      get: function() {
        return {
          RECEIVER_ADDRESS: receiver,
          SENDER_ADDRESS: sender
        };
      },
      set: function() {}
    };

    /**
     * This method loads the return shipment for the orginal shipment associated with the given tracking number.
     * The shipment data are saved as global fields: addresses and rates.
     * @param  {string} trackingId The given tracking number.
     */
    self.load = function(trackingId) {

      var setAddresses = function(response) {
        receiver = response.content.result.address_to;
        receiver.is_editable = false;
        receiver.address_type = 'RECEIVER_ADDRESS';

        sender = response.content.result.address_from;
        sender.is_editable = true;
        sender.address_type = 'SENDER_ADDRESS';
      };

      var setRates = function(response) {

      };

      CommonRequest.shipment.get({
        trackingNumber: trackingId
      }, function(response) {
        if (response && response.content) {
          setAddresses(response);

          console.log(self.addresses.get());

          // refactor
          self.rates = response.content.result.rates;
        }
      });
    };

    /**
     * This function updates the shipment storage object when an address is changed.
     * @param  {object} address The new address information with the address_type.
     */
    self.update = function(address) {
      console.log(self.addresses);

      self.addresses[address.address_type] = address;
      // update request
      console.log(self.addresses);
    };

    return self;
  }
];
