module.exports = [
  '$routeParams', 'StorageShipment', 'StorageTransaction',
function(
  $routeParams, StorageShipment, StorageTransaction
) {
  'use strict';
  var self = this;

  self.currentAddress = false;

  if ($routeParams.trackingId) {
    StorageShipment.load($routeParams.trackingId);
  }

  self.rates = function() {
    var rates = StorageShipment.rates;
    return rates;
  };

  self.addresses = function() {
    var addresses = StorageShipment.addresses;
    return addresses;
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

  //TEST MODALS!!!
  // StorageTransaction.openPaymentMethodModal();

}];
