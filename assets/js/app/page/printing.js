module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';
    var self = this;

    self.currentAddress = false;

    if ($routeParams.trackingId) {
      StorageShipment.load($routeParams.trackingId);
    }

    self.rates = function() {
      return StorageShipment.rates;
    };

    self.addresses = function() {
      return StorageShipment.addresses;
    };

    self.editAddress = function(address, addressType) {
      self.currentAddress = address;
    };

    var update = function() {
      StorageShipment.update(self.currentAddress);
      self.currentAddress = false;
    };

    self.formConfig = {
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: update
      },
      model: function() {
        return self.currentAddress;
      },
      flags: {
        enhanceFields: true
      }
    };

    self.partialSearch = function() {
      return true;
    };
    self.selectRate = function() {
      return true;
    };
    self.calculatePickupDate = function() {
      return true;
    };
    self.utcOffset = function() {
      return true;
    };
    self.getSelectedSurcharge = function() {
      return true;
    };



    // MODAL CONFIGURATION

    // DEBUGGING
    console.log('%c' + '\t\t\t\t\t\tStorage\t\t\t\t\t\tModal', 'font-weight:bold');

    self.openPaymentMethodModal = function() {
      var url = 'views/partials/modals/payment_methods.html';

      var selectPaymentMethod = function(paymentMethod) {
        CommonUi.modal.data.selected = paymentMethod;
        console.log('[selected method] \t\t' + StorageTransaction.selectedPaymentMethod + '\t\t\t\t\t\t' + CommonUi.modal.data.selected);
      };

      var cleanPaymentDataInput = function(property) {
        if (!CommonUi.modal.data.account || !CommonUi.modal.data.account[property]) {
          return;
        }
        if (CommonUi.modal.data.account[property].search(/\W/) !== -1) {
          CommonUi.modal.data.account[property] = CommonUi.modal.data.account[property].replace(/\W/g, '');
        }
        console.log('[account ' + property + '] \t\t\t' + StorageTransaction.paymentMethods.SOFORT_UEBERWEISUNG.data + '\t\t\t\t\t\t' + CommonUi.modal.data.account[property]);
      };

      var submitSelection = function() {
        StorageTransaction.selectedPaymentMethod = CommonUi.modal.data.selected;
        console.log('%c' + '--- Submit -----------------------------------------------------------------', 'font-weight:bold');
        console.log('[selected method] \t\t' + StorageTransaction.selectedPaymentMethod + '\t\t\t' + CommonUi.modal.data.selected);
        if (CommonUi.modal.data.account !== null) {
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data = {};
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.iban = CommonUi.modal.data.account.iban;
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.bic = CommonUi.modal.data.account.bic;
          console.log('[account iban] \t\t\t' + StorageTransaction.paymentMethods.SOFORT_UEBERWEISUNG.data.iban + '\t\t' + CommonUi.modal.data.account.iban);
          console.log('[account bic] \t\t\t' + StorageTransaction.paymentMethods.SOFORT_UEBERWEISUNG.data.bic + '\t\t\t\t\t' + CommonUi.modal.data.account.bic);
        }
      };

      CommonUi.modal.show(url, true, {
        methods: Object.keys(StorageTransaction.paymentMethods),
        selected: 'PAYPAL',
        account: null
      }, null, {
        selectMethod: selectPaymentMethod,
        cleanData: cleanPaymentDataInput,
        submit: submitSelection
      });
    };

    self.openPaymentMethodModal();

  }
];
