module.exports = [
  'CommonUi', 'CommonRequest',
  function(
    CommonUi, CommonRequest
  ) {
    'use strict';
    var self = this;

    self.availablePaymentMethods = ['PAYPAL', 'SOFORT_UEBERWEISUNG'];

    self.openPaymentMethodModal = function() {
      var url = 'views/partials/modals/paymentMethod.html';

      var selectPaymentMethod = function(paymentMethod) {
        console.log(paymentMethod);
      };



      CommonUi.modal.show(url, true, {
        availableMethods: self.availablePaymentMethods
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
