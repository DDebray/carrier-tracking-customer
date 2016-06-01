module.exports = [
  'CommonUi', /*'StorageCountries',*/
function(
  CommonUi/*, StorageCountries*/
) {
  'use strict';
  var self = this;

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

  self.receiver = {
  // self.sender = {
    id: 1000033,
    name: 'Andreas Kühnel',
    company: null,
    street1: 'Page St',
    street_no: '386',
    street2: null,
    postal_code: '94102',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    phone: '0123465465',
    email: null,
    residential: null
  };

  self.sender = {
  // self.receiver = {
    id: 1000033,
    name: 'Max Mustermann',
    company: null,
    street1: 'Julie-Wolfthorn-Straße',
    street_no: '1',
    street2: null,
    postal_code: '10115',
    city: 'Berlin',
    state: null,
    country: 'DE',
    phone: '0123465465',
    email: 'mustermx@coureon.com',
    residential: null
  };

  self.editAddress = function(address, addressType) {
    var hasUser = StorageBase.config && StorageBase.config.user;

    self.editing = address || self.sender;
  };

  self.editing = false;

  var save = function() {
    self.editing = false;

    // StorageAddresses.save(self.editing, function() {
    //   StorageAddresses.reload(true, function() {
    //   });
    // });
    console.log('message', message);
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
      country : true,
    }
  };

}];
