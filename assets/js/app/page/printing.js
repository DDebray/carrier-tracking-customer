module.exports = [
  '$routeParams', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, $timeout, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';
    var self = this;

    self.currentAddress = false;
    self.selectedRate = null;
    self.state = 'IDLE'; // PENDING, COMPLETED, ERROR

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

    self.buy = function () {
      CommonUi.modal.data.status = 'PENDING';

      // TODO: comunicate with the backend...

      $timeout(function() {
        CommonUi.modal.data.status = 'COMPLETED';
      }, 1000);

      $timeout(function() {
        CommonUi.modal.data.status = 'ERROR';
      }, 2500);
    };

    // MODAL CONFIGURATION
    self.selectRate = function (rate) {
      console.log('selectRate: ', rate);
      self.selectedRate = rate;

      // TODO: insert releveant data into modal data...
      CommonUi.modal.show('/views/partials/modals/print_one.html', true, {
        rate : rate,
        status : 'IDLE',
        buy : self.buy,
        download_result : {
          download_urls : [
            {
              url : ['http://www.coureon.com'],
              format: 'a5',
              count: 1
            }, {
              url : ['http://www.coureon.com'],
              format: 'a4',
              name: 'DPD_DROPOFF_RECEIPT_LABEL',
              count: 1
            }
          ],
          customs_urls : {
            hints: []
            // hints : [
            //   {
            //     carrier_code: 'dpd',
            //     link: 'dpd'
            //   }
            // ]
          }
        }
      });
    };

    // DEBUGGING

    self.openPaymentMethodModal = function() {
      var url = 'views/partials/modals/payment_methods.html';

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

      var submitSelection = function() {
        StorageTransaction.selectedPaymentMethod = CommonUi.modal.data.selected;
        if (CommonUi.modal.data.account !== null) {
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data = {};
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.iban = CommonUi.modal.data.account.iban;
          StorageTransaction.paymentMethods[StorageTransaction.selectedPaymentMethod].data.bic = CommonUi.modal.data.account.bic;
        }
      };

      CommonUi.modal.show(url, true, {
        methods : Object.keys(StorageTransaction.paymentMethods),
        icons : {
          credit_card : 'fa-credit-card',
          paypal : 'fa-paypal',
          sofort_ueberweisung : 'fa-university'
        },
        selected : 'SOFORT_UEBERWEISUNG',
        account : null
      }, null, {
        selectMethod : selectPaymentMethod,
        cleanData : cleanPaymentDataInput,
        submit : submitSelection
      });
    };
  }
];
