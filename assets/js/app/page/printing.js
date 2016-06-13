module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageAddresses', /*'StorageCountries',*/
function(
  $routeParams, CommonUi, StorageShipment, StorageAddresses/*, StorageCountries*/
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

  self.labels = [
    {
      title : 'DHL Paket Abgabe',
      details : {
        'fa fa-truck' : 'Abgabe im Pakteshop möglich',
        'fa fa-tachometer' : '2-4 Tage Lieferzeit'
      }
    },
    {
      title : 'DHL Paket Abgabe',
      details : {
        'fa fa-truck' : 'Abgabe im Pakteshop möglich',
        'fa fa-tachometer' : '2-4 Tage Lieferzeit'
      }
    },
    {
      title : 'DHL Paket Abgabe',
      details : {
        'fa fa-truck' : 'Abgabe im Pakteshop möglich',
        'fa fa-tachometer' : '2-4 Tage Lieferzeit'
      }
    },
    {
      title : 'DHL Paket Abgabe',
      details : {
        'fa fa-truck' : 'Abgabe im Pakteshop möglich',
        'fa fa-tachometer' : '2-4 Tage Lieferzeit'
      }
    }
  ];

  //FOLLOWING CODE IS CLEAN!!!
  self.currentAddress = false;

  if ($routeParams.trackingId) {
    StorageShipment.load($routeParams.trackingId);
  }

  self.addresses = function() {
    var addresses = StorageShipment.addresses;
    return addresses;
  };

  self.editAddress = function(address, addressType) {
    self.currentAddress = address;
  };

  var update = function() {
    // TODO: Put code for updating here.
    StorageShipment.update(self.currentAddress);
    self.currentAddress = false;
  };

  self.formConfig = {
    submit : {
      label : 'PAGE.ADDRESSES.SAVE',
      action : update
    },
    model : function() {
      return self.currentAddress;
    },
    flags : {
      enhanceFields : true
    }
  };
}];
