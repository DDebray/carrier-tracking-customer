module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageTransaction',
function(
  $routeParams, CommonUi, StorageShipment, StorageTransaction
) {
  'use strict';
  var self = this;

  self.currentAddress = false;
  self.selectedRate = null;

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
    submit : {
      label : 'COMMON.ADDRESSES.SAVE',
      action : update
    },
    model : function() {
      return self.currentAddress;
    },
    flags : {
      enhanceFields : true
    }
  };

  self.selectRate = function (rate) {
    console.log('selectRate: ', rate);
    self.selectedRate = rate;
    CommonUi.modal.show('/views/partials/modals/print_one.html', true, { rate : rate });
  };

  // TEST MODALS!!!
  // StorageTransaction.openPaymentMethodModal();

}];
