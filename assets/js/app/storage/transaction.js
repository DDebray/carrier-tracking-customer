module.exports = [
  'CommonUi', 'CommonRequest',
  function(
    CommonUi, CommonRequest
  ) {
    'use strict';
    var self = this;

    self.availablePaymentMethods = {
      PAYPAL : {
        icon : 'fa-paypal',
        data : {}
      },
      SOFORT_UEBERWEISUNG : {
        icon : 'fa-envelope',
        data : {}
      }
    };
    self.selectedPaymentMethod = 'PAYPAL';


    self.openPaymentMethodModal = function() {
      var url = 'views/partials/modals/payment_methods.html';

      var selectPaymentMethod = function(paymentMethod) {
        CommonUi.modal.data.selectedMethod = paymentMethod;
        console.log('Modal: ', CommonUi.modal.data.selectedMethod);
        console.log('Storage: ', self.selectedPaymentMethod);
      };

      var submitPaymentMethodSelection = function() {
        self.selectedPaymentMethod = CommonUi.modal.data.selectedMethod;
        console.log('Transaction Storage: ', self.selectedPaymentMethod);
      };

      var changePaymentData = function(paymentMethod) {
        console.log('Modal: ', CommonUi.modal.data.paymentData);
        console.log('Storage: ', self.availablePaymentMethods[paymentMethod].data);
        console.log(CommonUi.modal.data);
      };

      CommonUi.modal.show(url, true, {
        availableMethods : self.availablePaymentMethods,
        selectedMethod : self.selectedPaymentMethod,
        paymentData : {}
      }, null, {
        selectMethod: selectPaymentMethod,
        submitSelection : submitPaymentMethodSelection,
        changeData : changePaymentData
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
