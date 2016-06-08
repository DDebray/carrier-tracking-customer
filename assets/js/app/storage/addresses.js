module.exports = [
  'CommonRequest', 'CommonUi',
function(
  CommonRequest, CommonUi
) {
  'use strict';
  var self = this,
    reloading = false;

  self.addresses = null;
  var staticAddresses = [{
    address_type: 'RECEIVER_ADDRESS',
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
    email: 'muster@coureon.com',
    residential: null,
    is_editable: true
  },{
    address_type: 'SENDER_ADDRESS',
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
    residential: null,
    is_editable: true
  }];

  // StorageControl.addReset(function() {
  //   reloading = false;
  //   self.reload();
  // });

  var convertAddresses = function(addresses) {
    var result = {
      RECEIVER_ADDRESS : null,
      SENDER_ADDRESS : null
    };

    Object.keys(result).map(function(addressType) {
      var defaultAddress = addresses.filter(function(address) {
        return address.address_type === addressType;
      })[0];

      if (defaultAddress) {
        result[addressType] = defaultAddress;
      }
    });

    var containsAddress = Object.keys(result).reduce(function(prev, curr) {
      return prev || !!result[curr];
    }, false);

    return containsAddress ? result : false;
  };

  self.reload = function(lock, cb) {
    if (reloading) {
      return;
    }

    // if (lock) {
    //   CommonUi.lock();
    // }

    // self.addresses = null;

    // reloading = true;
    // CommonRequest.addresses.get({}, function(response) {
    //   if (lock) {
    //     CommonUi.unlock();
    //   }
    //
    //   reloading = false;
    //
    //   if (response && response.content) {
    //     self.addresses = convertAddresses(response.content.addresses || []);
    //
    //     if (cb) {
    //       cb(response);
    //     }
    //   }

    // }, function() {
    //   CommonUi.unlock();
    //   reloading = false;
    //   self.addresses = false;
    // });

    self.addresses = convertAddresses(staticAddresses || []);
    console.log('converted addresses', self.addresses);
  };

  // self.save = function(address, cb) {
  //   CommonUi.lock();
  //
  //   CommonRequest.addresses[address.id ? 'update' : 'save'](address.id ? {
  //     addressId : address.id
  //   } : {}, {
  //     client_address : address
  //   }, function(response) {
  //     CommonUi.unlock();
  //
  //     if (cb) {
  //       cb(response);
  //     }
  //   }, function() {
  //     CommonUi.unlock();
  //   });
  // };
  //
  self.reload(true);

  return self;
}];
