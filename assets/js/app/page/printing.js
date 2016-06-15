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

  // This isn't like super clean
  self.partialSearch = function () { return true; };
  self.selectRate = function () { return true; };
  self.calculatePickupDate = function () { return true; };
  self.utcOffset = function () { return true; };
  self.getSelectedSurcharge = function () { return true; };

  // TEST MODALS!!!
  // StorageTransaction.openPaymentMethodModal();

}];
