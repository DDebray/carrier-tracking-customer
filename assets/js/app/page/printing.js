module.exports = [
  '$routeParams', 'CommonUi', 'StorageShipment', 'StorageAddresses', /*'StorageCountries',*/
function(
  $routeParams, CommonUi, StorageShipment, StorageAddresses/*, StorageCountries*/
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

}];
