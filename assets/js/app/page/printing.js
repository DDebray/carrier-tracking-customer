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
      console.log('method', method);
      console.log('rates', rates);

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

  // StorageCountries.load(function(countries) {
  //   // self.formConfig.receiver.countryList = countries;
  //   self.countryList = countries;
  //   console.log('countries', countries);
  //
  // });

  // var addresses = StorageAddresses.addresses;
  // console.log('addresses', addresses);

  if ($routeParams.trackingId) {
    StorageShipment.load($routeParams.trackingId);
  }

  self.addressItems = function() {
    // TODO: change this to storage shipment
    var addresses = StorageShipment.addresses;

    if (addresses === false && !self.editing) {
      self.edit();
    }

    return addresses;
  };

  self.editAddress = function(address, addressType) {

    // var hasUser = StorageBase.config && StorageBase.config.user;

    // console.log('edit', address, addressType);

    self.editing = address;
  };

  self.editing = false;

  var save = function() {
    self.editing = false;

    // StorageAddresses.save(self.editing, function() {
    //   StorageAddresses.reload(true, function() {
    //   });
    // });
  };

  self.senderFormConfig = {
    submit : {
      label : 'PAGE.ADDRESSES.SAVE',
      action : save
    },
    model : function() {
      return self.editing;
    },
    hide : {
      // country : true,
    }
  };

  self.originalRates = function() {
    var rates = StorageShipment.rates;
    return rates;
  };

  // self.originalRates = [
  //   {
  //     'code': 'dpag_national',
  //     'carrier_code': 'dpag',
  //     'gross_amount': 4.8,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 4,
  //     'surcharges': [
  //       {
  //         'code': '19:dpag_einschreiben',
  //         'name': 'dpag_einschreiben',
  //         'amount': 2.5
  //       },
  //       {
  //         'code': '20:dpag_einschreiben_einwurf',
  //         'name': 'dpag_einschreiben_einwurf',
  //         'amount': 2.15
  //       },
  //       {
  //         'code': '21:dpag_einschreiben_eigenhaendig',
  //         'name': 'dpag_einschreiben_eigenhaendig',
  //         'amount': 4.65
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'dpd_national_pickup',
  //     'carrier_code': 'dpd',
  //     'gross_amount': 3.99,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 2,
  //     'surcharges': [
  //       {
  //         'code': '-1:DemoHoeherversicherung_2500EUR',
  //         'name': 'DemoHoeherversicherung_2500EUR',
  //         'amount': 3.75
  //       },
  //       {
  //         'code': '24:dpd_predict',
  //         'name': 'dpd_predict',
  //         'amount': 0
  //       },
  //       {
  //         'code': '25:dpd_tyre',
  //         'name': 'dpd_tyre',
  //         'amount': 5
  //       },
  //       {
  //         'code': '26:dpd_tyre_predict',
  //         'name': 'dpd_tyre_predict',
  //         'amount': 5
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'dpd_national_dropoff',
  //     'carrier_code': 'dpd',
  //     'gross_amount': 3.99,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 2,
  //     'surcharges': [
  //       {
  //         'code': '3:dpd_tyre',
  //         'name': 'dpd_tyre',
  //         'amount': 3.75
  //       },
  //       {
  //         'code': '4:dpd_tyre_predict',
  //         'name': 'dpd_tyre_predict',
  //         'amount': 3.75
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'ccl_national_pickup',
  //     'carrier_code': 'cclogistics',
  //     'gross_amount': 28.02,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 1,
  //     'surcharges': []
  //   },
  //   {
  //     'code': 'ccl_national_priority_pickup',
  //     'carrier_code': 'cclogistics',
  //     'gross_amount': 29.57,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 1,
  //     'surcharges': [
  //       {
  //         'code': '8:ccl_time_8',
  //         'name': 'ccl_time_8',
  //         'amount': 15
  //       },
  //       {
  //         'code': '9:ccl_time_9',
  //         'name': 'ccl_time_9',
  //         'amount': 9
  //       },
  //       {
  //         'code': '10:ccl_saturday',
  //         'name': 'ccl_saturday',
  //         'amount': 12.5
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'gel_national_pickup',
  //     'carrier_code': 'gelexpress',
  //     'gross_amount': 33.5,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 1,
  //     'surcharges': [
  //       {
  //         'code': '27:gel_time_10',
  //         'name': 'gel_time_10',
  //         'amount': 28
  //       },
  //       {
  //         'code': '28:gel_time_12',
  //         'name': 'gel_time_12',
  //         'amount': 16
  //       },
  //       {
  //         'code': '29:gel_saturday_10',
  //         'name': 'gel_saturday_10',
  //         'amount': 49
  //       },
  //       {
  //         'code': '30:gel_saturday_12',
  //         'name': 'gel_saturday_12',
  //         'amount': 28
  //       },
  //       {
  //         'code': '31:gel_afternoon',
  //         'name': 'gel_afternoon',
  //         'amount': 8
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'gel_national_xxl_pickup',
  //     'carrier_code': 'gelexpress',
  //     'gross_amount': 81.10000000000001,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 1,
  //     'surcharges': []
  //   },
  //   {
  //     'code': 'gel_national_pallet_pickup',
  //     'carrier_code': 'gelexpress',
  //     'gross_amount': 98.35000000000001,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 1,
  //     'surcharges': []
  //   },
  //   {
  //     'code': 'hermes_national_pickup',
  //     'carrier_code': 'hermes',
  //     'gross_amount': 4.11,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 2,
  //     'surcharges': [
  //       {
  //         'code': '33:hermes_pickup',
  //         'name': 'hermes_pickup',
  //         'amount': 3
  //       }
  //     ]
  //   },
  //   {
  //     'code': 'myhermes_national',
  //     'carrier_code': 'hermes',
  //     'gross_amount': 4.58,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 2,
  //     'surcharges': []
  //   },
  //   {
  //     'code': 'ups_standard_dropoff',
  //     'carrier_code': 'ups',
  //     'gross_amount': 8.75,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 3,
  //     'surcharges': []
  //   },
  //   {
  //     'code': 'ups_standard_pickup',
  //     'carrier_code': 'ups',
  //     'gross_amount': 8.75,
  //     'currency': 'EUR',
  //     'days_min': 1,
  //     'days_max': 3,
  //     'surcharges': []
  //   }
  // ];

}];
