module.exports = ['$routeParams', 'CommonRequest', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function($routeParams, CommonRequest, $timeout, CommonUi, StorageShipment, StorageTransaction) {
    const authorization = $routeParams.authorization;

    CommonRequest.setToken(authorization);
    CommonRequest.return.shipment.get({}).$promise.then(result => console.log(result)).catch(error => console.log(error));

    this.senderAddress = false;

    this.addressForm = {
      model: () => this.senderAddress,
      flags: {
        enhanceFields: false
      },
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: () => {
          StorageShipment.updateResource(this.senderAddress);
          StorageTransaction.updatedAddress = self.senderAddress;
          self.senderAddress = false;
        }
      }
    };

    self.selectedAddress = 'SENDER_ADDRESS';

    self.addresses = () => StorageShipment.addresses;

    self.rates = () => StorageShipment.rates;

    this.senderAddressForm = (address, addressType) => {
      this.senderAddress = address;
    };

    self.selectRate = rate => {
      if (!this.senderAddress) {
        StorageTransaction.selectedRate = rate;
        console.log(rate);
      }
    };

    self.showError = () => StorageShipment.error;

    self.showNotifications = () => StorageShipment.notifications;

    var getInvoiceAddress = function () {
      var invoiceAddress = Object.assign( {}, self.addresses()[ self.selectedAddress ] );
      invoiceAddress.address_type = 'INVOICE_ADDRESS';
      return invoiceAddress;
    };
  }
];
