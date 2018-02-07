module.exports = ['$routeParams', 'CommonRequest',
  function($routeParams, CommonRequest) {
    const authorization = $routeParams.authorization;
    this.shipment = null;
    this.errors = false;
    this.isEditingAddress = true;
    this.senderAddress = {
      country: 'DE'
    };
    this.package = {
      length: 60,
      width: 30,
      height: 15,
      weight: 2,
      distance_unit: 'cm',
      mass_unit: 'kg'
    };

    const getAssembledShipment = () => {
      return Object.assign({}, {
        packages: [this.package],
        address_from: this.senderAddress
      });
    };

    const disassembleShipment = shipment => {
      this.senderAddress = Object.assign({}, shipment && shipment.address_from || this.senderAddress);
      this.package = Object.assign({}, shipment && shipment.packages && shipment.packages[0] || this.package);
    };

    this.onUpdate = response => {
      console.log(response);

      if (!response || !response.status) {
        // TODO show generic error
        return;
      }

      if (response.status === 'ERROR' || typeof response.status === 'number') {
        return (this.errors = response.messages || response.data && response.data.messages);
      }

      const shipment = response.content && response.content.shipment || this.shipment;
      this.shipment = shipment;
      disassembleShipment(shipment);
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
          this.updateRates();
          this.isEditingAddress = false;
        }
      }
    };

    this.updateRates = () => {
      return CommonRequest.return.calculateRates.save({}, {shipment: getAssembledShipment()}).$promise.then(this.onUpdate).catch(this.onUpdate);
    };

    this.selectRate = rate => {
      console.log(rate);
    }
  }
];
