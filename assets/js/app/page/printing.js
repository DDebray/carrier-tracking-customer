module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageTransaction',
function(
  $routeParams, CommonUi, StorageShipment, StorageTransaction
) {
  'use strict';
  var self = this;

  self.sort = {
    items : ['price', 'speed'],
    current : 'price',
    priceRange : [],
    change : function(method, rates) {
      rates = rates || self.originalRates;

      this.current = method || this.current;
      this.priceRange = this.methods.price([].concat(rates)).filter(function(rate, index) {
        return index === 0 || index === rates.length - 1;
      }).filter(function(rate, index, rateArray) {
        var rateAmountArray = rateArray.map(function(rate) {
          return rate.amount;
        });

        return rateAmountArray.indexOf(rate.amount) === index;
      });

      self.originalRates = this.methods[this.current]([].concat(rates));
    },
    methods : {
      price : function(rates) {
        rates.sort(function(a, b) {
          return a.amount - b.amount;
        });

        return rates;
      },
      speed : function(rates) {
        rates = this.price(rates);
        rates.sort(function(a, b) {
          return (a.days_min + a.days_max) - (b.days_min + b.days_max);
        });

        return rates;
      }
    }
  };

  //FOLLOWING CODE IS CLEAN!!!
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
