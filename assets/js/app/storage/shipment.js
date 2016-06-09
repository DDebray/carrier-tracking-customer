module.exports = [
  'CommonRequest',
  function(
    CommonRequest
  ) {
    'use strict';

    var self = this;

    self.addresses = {};
    self.rates = null;

    self.load = function(trackingId) {
      console.log(trackingId);

      CommonRequest.shipment.get({
        trackingNumber: trackingId
      }, function(response) {
        if (response && response.content) {
          console.log(response.content);


          setAddresses(response.content.result.address_from, response.content.result.address_to);
          self.rates = response.content.result.rates;
          console.log(self.rates);
        }
      });
    };

    var setAddresses = function(sender, receiver) {
      self.addresses.RECEIVER_ADDRESS = receiver;
      self.addresses.RECEIVER_ADDRESS.is_editable = false;
      self.addresses.RECEIVER_ADDRESS.address_type = 'RECEIVER_ADDRESS';

      self.addresses.SENDER_ADDRESS = sender;
      self.addresses.SENDER_ADDRESS.is_editable = true;
      self.addresses.SENDER_ADDRESS.address_type = 'SENDER_ADDRESS';

      console.log(self.addresses);
    };

    return self;
  }
];
