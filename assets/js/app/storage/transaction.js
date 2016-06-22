module.exports = [
  'CommonRequest',
  function(
    CommonRequest
  ) {
    'use strict';

    var self = this;

    self.selectedPaymentMethod = null;
    self.paymentMethods = {
      CREDIT_CARD: {
        data: null
      },
      PAYPAL: {
        data: null
      },
      SOFORT_UEBERWEISUNG: {
        data: null
      }
    };

    self.make = function() {
      CommonRequest.shipment.get({
        trackingNumber: trackingId,
        postalCode: postalCode
      }, function(response) {
        if (response && response.content) {
          fillAddresses(response.content.result.address_from, response.content.result.address_to);
          self.rates = response.content.result.rates;
        }
      }, function(error) {
        errorCallback();
      });
    };

    return self;
  }
];
