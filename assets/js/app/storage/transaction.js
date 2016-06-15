module.exports = [
  'CommonUi', 'CommonRequest',
  function(
    CommonUi, CommonRequest
  ) {
    'use strict';
    var self = this;

    self.availablePaymentMethods = {
      PAYPAL: 'fa-paypal',
      SOFORT_UEBERWEISUNG: 'fa-envelope'
    };
    self.selectedPaymentMethod = 'SOFORT_UEBERWEISUNG';


    self.openPaymentMethodModal = function() {
      var url = 'views/partials/modals/paymentMethod.html';


      var selectPaymentMethod = function(paymentMethod) {
        selectPaymentMethod = paymentMethod;
        CommonUi.modal.data.selectedMethod = paymentMethod;
      };

      CommonUi.modal.show(url, true, {
        availableMethods: self.availablePaymentMethods,
        selectedMethod: self.selectedPaymentMethod
      }, null, {
        selectMethod: selectPaymentMethod
      });
    };

    self.openPrintModal = function() {
      var url = 'views/partials/';
    };

    self.openApprovalModal = function() {
      var url = 'views/partials/';

    };


    return self;
  }
];
