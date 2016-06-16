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

    return self;
  }
];
