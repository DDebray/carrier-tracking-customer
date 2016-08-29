module.exports = [
  '$routeParams', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function(
    $routeParams, $timeout, CommonUi, StorageShipment, StorageTransaction
  ) {
    'use strict';

    var self = this,
      trackingId = $routeParams.trackingId;

    self.openAddress = false;
    self.postalCodeForVerification = '';

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
          StorageShipment.updateResource( self.openAddress );
          StorageTransaction.updatedAddress = self.openAddress;
          self.openAddress = false;
        }
      }
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

    self.openAddressForm = function( address, addressType ) {
      self.openAddress = address;
    };

    self.selectRate = function( rate ) {
      if ( !self.openAddress ) {
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
      CommonUi.modal.show( 'views/partials/modals/transaction.html', false, {
        methods: Object.keys( StorageTransaction.methods ),
        methodsIcons: self.methodsIcons,
        selectedMethod: 'SOFORT_UEBERWEISUNG',
        selectedRate: StorageTransaction.selectedRate,
        account: null,
        downloads: {},
        transactionErrors: {},
        status: 'SELECT_METHOD' // DO_TRANSACTION, WAIT_FOR_ANSWER, SHOW_APPROVAL, SHOW_ERROR
      }, null, {
        selectMethod: function( paymentMethod ) {
          CommonUi.modal.data.selectedMethod = ( paymentMethod === 'CREDIT_CARD' ) ? CommonUi.modal.data.selectedMethod : paymentMethod;
        },
        submitMethod: function() {
          StorageTransaction.selectedMethod = CommonUi.modal.data.selectedMethod;
          if ( CommonUi.modal.data.account !== null ) {
            StorageTransaction.methods[ StorageTransaction.selectedMethod ].data = {};
            StorageTransaction.methods[ StorageTransaction.selectedMethod ].data.iban = CommonUi.modal.data.account.iban;
            StorageTransaction.methods[ StorageTransaction.selectedMethod ].data.bic = CommonUi.modal.data.account.bic;
          }
          CommonUi.modal.data.status = 'DO_TRANSACTION';
        },
        doTransaction: function() {
          CommonUi.modal.data.status = 'WAIT_FOR_ANSWER';
          CommonUi.lock();
          StorageTransaction.transactionCallback = this.finishTransaction;
          StorageTransaction.start( trackingId, self.postalCodeForVerification );
        },
        finishTransaction: function( error, transactionErrors, downloads ) {
          if ( !error ) {
            CommonUi.modal.data.status = 'SHOW_APPROVAL';
            downloads.forEach(
              function( file ) {
                // TODO: COUREON-2062
                // This is a static and temporary fix. it should be removed,
                // when the ticket COUREON-2062 has been solved.
                if ( file.format === 'A4_BY_4' ) {
                  file.format = 'A5';
                }
                // END OF FIX.

                CommonUi.modal.data.downloads[ file.name ] = {};
                CommonUi.modal.data.downloads[ file.name ].url = file.url;
                CommonUi.modal.data.downloads[ file.name ].format = file.format;
                CommonUi.modal.data.downloads[ file.name ].count = file.count;
              } );
          } else {
            CommonUi.modal.data.status = 'SHOW_ERROR';
            CommonUi.modal.data.transactionErrors = transactionErrors;
          }
          CommonUi.modal.closable = true;
          CommonUi.unlock();
        }
      } );
    };

    var showVerificationModal = function() {
      CommonUi.modal.show( '/views/partials/modals/verification.html', false, null, null, {
        submitVerification: function() {
          if ( CommonUi.modal.data.postalCodeForVerification && CommonUi.modal.data.postalCodeForVerification !== '' ) {
            self.postalCodeForVerification = CommonUi.modal.data.postalCodeForVerification;
            StorageShipment.createResource( trackingId, self.postalCodeForVerification );
            CommonUi.modal.hide();
          }
        }
      } );
    };

    showVerificationModal();
  }
];
