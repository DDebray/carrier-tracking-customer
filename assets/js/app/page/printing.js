module.exports = [
  '$routeParams', 'CommonUi', 'CommonRequest', 'StorageShipment', 'StorageAddresses', /*'StorageCountries',*/
  function(
    $routeParams, CommonUi, CommonRequest, StorageShipment, StorageAddresses /*, StorageCountries*/
  ) {
    'use strict';
    var self = this;

    // Get trackingId from url and load associated shipment.
    if ($routeParams.trackingId) {
      StorageShipment.load($routeParams.trackingId);
    }

    self.addresses = function() {
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
      submit: {
        label: 'PAGE.ADDRESSES.SAVE',
        action: save
      },
      model: function() {
        return self.editing;
      },
      hide: {
        // country : true,
      }
    };

  }
];
