module.exports = ['$routeParams', 'CommonRequest', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function($routeParams, CommonRequest, $timeout, CommonUi, StorageShipment, StorageTransaction) {
    const authorization = $routeParams.authorization;
    this.shipment = null;
    this.errors = false;
    this.notifications = false;
    this.senderAddress = {
      country: 'DE'
    };
    this.isEditingAddress = true;

    this.onUpdate = response => {
      console.log(response);

      if (!response) {
        // TODO show generic error
        return;
      }

      if (response.status === 'ERROR') {
        return this.errors = response.messages;
      }

      const shipment = response.content && response.content.shipment || this.shipment;
      this.shipment = shipment;
      this.senderAddress = Object.assign({}, shipment && shipment.address_from || this.senderAddress);
    };

    CommonRequest.setToken(authorization);
    CommonRequest.return.shipment.get({}).$promise.then(this.onUpdate).catch(this.onUpdate);

    this.addressForm = {
      model: () => this.senderAddress,
      flags: {
        enhanceFields: true
      },
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: () => {
          this.shipment.address_from = Object.assign({}, this.senderAddress);
          this.updateRates();
          this.isEditingAddress = false;
        }
      }
    };

    this.updateRates = () => {
      return CommonRequest.return.calculateRates.save({}, {shipment: this.shipment}).$promise.then(this.onUpdate).catch(this.onUpdate);
    };

/*
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
*/
  }
];
