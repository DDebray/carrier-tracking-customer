module.exports = ['$routeParams', 'CommonRequest', '$timeout', 'CommonUi', 'StorageShipment', 'StorageTransaction',
  function($routeParams, CommonRequest, $timeout, CommonUi, StorageShipment, StorageTransaction) {
    const authorization = $routeParams.authorization;
    this.shipment = null;
    this.errors = false;
    this.notifications = false;
    this.senderAddress = {};

    CommonRequest.setToken(authorization);
    CommonRequest.return.shipment.get({}).$promise.then(response => {
      this.onUpdate(response && response.shipment);
      console.log(response);
    }).catch(error => console.log(error));

    this.onUpdate = shipment => {
      this.shipment = shipment;
      this.senderAddress = Object.assign({}, shipment && shipment.address_from || this.senderAddress);
    };

    this.addressForm = {
      model: () => this.shipment && this.shipment.address_from,
      flags: {
        enhanceFields: false
      },
      submit: {
        label: 'COMMON.ADDRESSES.SAVE',
        action: () => {
          this.shipment.address_from = Object.assign({}, this.senderAddress);
          //StorageShipment.updateResource(this.senderAddress);
          // StorageTransaction.updatedAddress = this.shipment.address_from;
        }
      }
    };

    this.updateRates = () => {
      CommonRequest.return.calculateRates.save({}, {shipment: this.shipment}).$promise.then(response => {
        this.onUpdate(response && response.shipment);
        console.log(response);
      }).catch(error => console.log(error));
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
