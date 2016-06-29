module.exports = [
  '$routeParams', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, $timeout, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';

    var self = this;

    self.trackingId = $routeParams.trackingId;

    self.openAddress = false;

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

    // self.selectedRate = null;

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

    var showVerificationModal = function() {
      CommonUi.modal.show('/views/partials/modals/verification.html', false, null, null, {
        submitVerification: function() {
          if (CommonUi.modal.data.postalCode && CommonUi.modal.data.postalCode !== '') {
            StorageShipment.createResource(self.trackingId, CommonUi.modal.data.postalCode);
            CommonUi.modal.hide();
          }
        }
      });
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
          StorageTransaction.start(self.trackingId, this.finishTransaction);
        },
        finishTransaction: function(successful, downloads) {
          $timeout(function() {
            if (successful) {
              CommonUi.modal.data.status = 'SHOW_APPROVAL';
              downloads.forEach(
                function(file) {
                  CommonUi.modal.data.downloads[file.name] = {};
                  CommonUi.modal.data.downloads[file.name].url = file.url;
                  CommonUi.modal.data.downloads[file.name].format = file.format;
                  CommonUi.modal.data.downloads[file.name].count = file.count;
                });
              CommonUi.modal.closable = true;
            } else {
              CommonUi.modal.data.status = 'SHOW_ERROR';
            }
            CommonUi.unlock();
          }, 1000, true);
        }
      });
    };

    showVerificationModal();

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
