module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';

    var self = this;

    /* GLOBAL FIELDS: */

    self.currentAddress = false;
    self.selectedRate = null;
    self.formConfig = {
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: function() {
          StorageShipment.updateResource(self.currentAddress);
          self.currentAddress = false;
        }
      },
      model: function() {
        return self.currentAddress;
      },
      flags: {
        enhanceFields: true
      }
    };
    self.notificationIcons = {
      warning: 'fa-exclamation-triangle',
      error: 'fa-exclamation',
    };

    /* GLOBAL FUNCTIONS */

    self.addresses = function() {
      return StorageShipment.addresses;
    };

    self.rates = function() {
      return StorageShipment.rates;
    };

    self.editAddress = function(address, addressType) {
      self.currentAddress = address;
    };

    self.selectRate = function(rate) {
      console.log('selectRate: ', rate);
      self.selectedRate = rate;
      self.openPaymentMethodModal();
    };

    self.showError = function() {
      return StorageShipment.error;
    };

    self.showNotifications = function() {
      return StorageShipment.notifications;
    };

    /* MODALS DEFINITION: */
    self.openVerificationModal = function() {
      var template = '/views/partials/modals/postal_code_verification.html';
      var submitPostalCodeVerification = function() {
        if ($routeParams.trackingId) {
          StorageShipment.createResource($routeParams.trackingId, CommonUi.modal.data.postalCode);
        }
        CommonUi.modal.hide();
      };

      CommonUi.modal.show(template, false, null, null, {
        submitVerification: submitPostalCodeVerification
      });
    };

    self.openPaymentMethodModal = function() {
      var template = 'views/partials/modals/payment_methods.html';

      var selectPaymentMethod = function(paymentMethod) {
        CommonUi.modal.data.selected = paymentMethod;
      };

      var cleanPaymentDataInput = function(property) {
        if (!CommonUi.modal.data.account || !CommonUi.modal.data.account[property]) {
          return;
        }
        if (CommonUi.modal.data.account[property].search(/\W/) !== -1) {
          CommonUi.modal.data.account[property] = CommonUi.modal.data.account[property].replace(/\W/g, '');
        }
      };

      var submitPaymentMethodSelection = function() {
        StorageTransaction.selectedPaymentMethod = CommonUi.modal.data.selected;
        if (CommonUi.modal.data.account !== null) {
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data = {};
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.iban = CommonUi.modal.data.account.iban;
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.bic = CommonUi.modal.data.account.bic;
        }
        console.log(StorageTransaction.selectedPaymentMethod);
        console.log(StorageTransaction.paymentMethods);
        CommonUi.modal.data.status = 'SUBMIT';
        // CommonUi.modal.hide();
        // CommonUi.modal.show('/views/partials/modals/print_one.html', true, {
        //   rate: rate
        // });
      };

      CommonUi.modal.show(template, true, {
        methods: Object.keys(StorageTransaction.paymentMethods),
        icons: {
          credit_card: 'fa-credit-card',
          paypal: 'fa-paypal',
          sofort_ueberweisung: 'fa-university'
        },
        selected: 'SOFORT_UEBERWEISUNG',
        account: null,
        status: 'SELECT'
      }, null, {
        selectMethod: selectPaymentMethod,
        cleanData: cleanPaymentDataInput,
        submit: submitPaymentMethodSelection
      });
    };

    /* PROCESS */

    /* 1. */
    self.openVerificationModal();
  }
];
