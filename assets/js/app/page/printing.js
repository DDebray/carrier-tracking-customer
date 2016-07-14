module.exports = [
  '$routeParams', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, $timeout, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';

    var self = this,
        trackingId = $routeParams.trackingId;

    self.openAddress = false;
    self.postalCode = '';
    self.isPostalCodeVerified = false;

    self.addressForm = {
      model: function() {
        return self.openAddress;
      },
      flags: {
        enhanceFields: true
      },
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: function() {
          StorageShipment.updateResource(self.openAddress);
          StorageTransaction.updatedAddress = self.openAddress;
          self.openAddress = false;
        }
      }
    };

    self.notificationIcons = {
      warning: 'fa-exclamation-triangle',
      error: 'fa-exclamation',
    };

    self.methodsIcons = {
      credit_card: 'fa-credit-card',
      paypal: 'fa-paypal',
      sofort_ueberweisung: 'fa-university'
    };

    self.addresses = function() {
      return StorageShipment.addresses;
    };

    self.rates = function() {
      return StorageShipment.rates;
    };

    self.openAddressForm = function(address, addressType) {
      self.openAddress = address;
    };

    self.selectRate = function(rate) {
      if (!self.openAddress) {
        StorageTransaction.selectedRate = rate;
        showTransactionModal();
      }
    };

    self.showError = function() {
      return StorageShipment.error;
    };

    self.showNotifications = function() {
      return StorageShipment.notifications;
    };

    var showTransactionModal = function() {
      CommonUi.modal.show('views/partials/modals/transaction.html', false, {
        methods: Object.keys(StorageTransaction.methods),
        methodsIcons: self.methodsIcons,
        selectedMethod: 'SOFORT_UEBERWEISUNG',
        selectedRate: StorageTransaction.selectedRate,
        account: null,
        downloads: {},
        status: 'SELECT_METHOD' // DO_TRANSACTION, WAIT_FOR_ANSWER, SHOW_APPROVAL, SHOW_ERROR
      }, null, {
        selectMethod: function(paymentMethod) {
          CommonUi.modal.data.selectedMethod = (paymentMethod === 'CREDIT_CARD') ? CommonUi.modal.data.selectedMethod : paymentMethod;
        },
        submitMethod: function() {
          StorageTransaction.selectedMethod = CommonUi.modal.data.selectedMethod;
          if (CommonUi.modal.data.account !== null) {
            StorageTransaction.methods[StorageTransaction.selectedMethod].data = {};
            StorageTransaction.methods[StorageTransaction.selectedMethod].data.iban = CommonUi.modal.data.account.iban;
            StorageTransaction.methods[StorageTransaction.selectedMethod].data.bic = CommonUi.modal.data.account.bic;
          }
          CommonUi.modal.data.status = 'DO_TRANSACTION';
        },
        doTransaction: function() {
          CommonUi.modal.data.status = 'WAIT_FOR_ANSWER';
          CommonUi.lock();
          StorageTransaction.transactionCallback = this.finishTransaction;
          StorageTransaction.start(trackingId);
        },
        finishTransaction: function(error, downloads) {
            if (!error) {
              CommonUi.modal.data.status = 'SHOW_APPROVAL';
              downloads.forEach(
                function(file) {
                  CommonUi.modal.data.downloads[file.name] = {};
                  CommonUi.modal.data.downloads[file.name].url = file.url;
                  CommonUi.modal.data.downloads[file.name].format = file.format;
                  CommonUi.modal.data.downloads[file.name].count = file.count;
                });
            }
            else {
              CommonUi.modal.data.status = 'SHOW_ERROR';
            }
            CommonUi.modal.closable = true;
            CommonUi.unlock();
        }
      });
    };

    self.submitVerification = function() {
      if (self.postalCode && self.postalCode !== '') {
        StorageShipment.createResource(trackingId, self.postalCode);
        // CommonUi.modal.hide();
        self.isPostalCodeVerified = true;
      }
    };


    var showVerificationModal = function() {
      CommonUi.modal.show('/views/partials/modals/verification.html', false, null, null, {
        submitVerification: function() {
          if (CommonUi.modal.data.postalCode && CommonUi.modal.data.postalCode !== '') {
            StorageShipment.createResource(trackingId, CommonUi.modal.data.postalCode);
            CommonUi.modal.hide();
          }
        }
      });
    };

    // showVerificationModal();

    // donwloads: {
    //   urls: [{
    //     url: ['http://www.coureon.com'],
    //     format: 'a5',
    //     count: 1
    //   }, {
    //     url: ['http://www.coureon.com'],
    //     format: 'a4',
    //     name: 'DPD_DROPOFF_RECEIPT_LABEL',
    //     count: 1
    //   }],
    //   customs_urls: {
    //     hints: []
    //       // hints : [
    //       //   {
    //       //     carrier_code: 'dpd',
    //       //     link: 'dpd'
    //       //   }
    //       // ]
    //   }
    // }
    //
    //


    // ,
    // cleanData: function(property) {
    //   if (!CommonUi.modal.data.account || !CommonUi.modal.data.account[property]) {
    //     return;
    //   }
    //   if (CommonUi.modal.data.account[property].search(/\W/) !== -1) {
    //     CommonUi.modal.data.account[property] = CommonUi.modal.data.account[property].replace(/\W/g, '');
    //   }
    // }

  }
];
