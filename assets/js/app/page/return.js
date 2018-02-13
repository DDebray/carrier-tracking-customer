module.exports = ['$routeParams', '$timeout', 'CommonRequest', 'CommonUi',
  function($routeParams, $timeout, CommonRequest, CommonUi) {
    const authorization = $routeParams.authorization;
    this.shipment = null;
    this.errors = false;
    this.isEditingAddress = true;
    const fakeAddress = {
      name: 'Max Mustermann',
      street1: 'Alexanderplatz',
      street_no: '1',
      postal_code: '10178',
      city: 'Berlin',
      country: 'DE'
    };
    this.senderAddress = {
      country: 'DE'
    };
    this.isPruneAddress = true;
    this.package = {
      length: 60,
      width: 30,
      height: 15,
      weight: 2,
      distance_unit: 'cm',
      mass_unit: 'kg',
      onChange: () => this.updateRates()
    };

    const getAssembledShipment = rateCode => {
      return Object.assign({}, {
        packages: [this.package],
        address_from: this.isPruneAddress ? fakeAddress : this.senderAddress,
        selected_rate_code: rateCode
      });
    };

    const disassembleShipment = shipment => {
      const addressFrom = shipment && shipment.address_from;
      this.senderAddress = Object.assign({}, addressFrom && addressFrom.name !== fakeAddress.name && addressFrom || this.senderAddress);
      this.package = Object.assign({}, shipment && shipment.packages && shipment.packages[0] || this.package, { onChange: this.package.onChange });
    };

    this.onUpdate = response => {
      if (!response || !response.status) {
        // TODO show generic error
        return;
      }

      if (response.status === 'ERROR' || typeof response.status === 'number') {
        return (this.errors = response.messages || response.data && response.data.messages);
      }

      const shipment = response.content && response.content.shipment || this.shipment;
      this.errors = false;
      this.shipment = shipment;
      disassembleShipment(shipment);

      if (!shipment.rates || !shipment.rates.length) {
        this.errors = [{ text: 'PAGE.RETURN.NO_RATES' }];
      }
    };

    this.updateRates = () => {
      return CommonRequest.return.calculateRates.save({}, { shipment: getAssembledShipment(null) }).$promise.then(this.onUpdate).catch(this.onUpdate);
    };

    CommonRequest.setToken(authorization);
    CommonRequest.return.shipment.get({}).$promise
      .then(this.onUpdate)
      .catch(this.onUpdate)
      .then(this.updateRates);

    this.addressForm = {
      model: () => this.senderAddress,
      flags: {
        enhanceFields: true
      },
      submit: {
        label: 'PAGE.RETURN.SENDER_ADDRESS.SAVE',
        action: () => {
          this.addressForm.submit.label = 'PAGE.RETURN.SENDER_ADDRESS.UPDATE';
          this.updateRates();
          this.isEditingAddress = false;
          this.isPruneAddress = false;
        }
      }
    };

    this.selectRate = rate => {
      CommonUi.modal.show( 'views/partials/modals/return/confirm.html', true, {
        rate,
        shipment: this.shipment,
        isBusy: false
      }, null, {
        confirm: modal => {
          modal.closable = false;
          modal.data.isBusy = true;
          CommonRequest.return.shipment.create({}, { shipment: getAssembledShipment(rate.code) })
            .$promise.then(this.onLabelCreationStarted).catch(this.onLabelCreationStarted);
        }
      });
    };

    this.onLabelCreationStarted = response => {
      if (response && (response.status !== 'OK' || typeof response.status === 'number')) {
        this.errors = response.messages;
        return CommonUi.modal.close();
      }

      if (!response || !response.status || !response.content || !response.content.task_id) {
        // TODO show generic error
        return CommonUi.modal.close();
      }

      CommonUi.modal.show( 'views/partials/modals/return/download.html', false, {
        isBusy: true
      }, null, {
        check: taskId => {
          CommonRequest.return.task.get({ taskId }).$promise
            .then(response => this.onLabelCreationPending(taskId, response))
            .catch(error => this.onLabelCreationPending(taskId, error));
        }
      });

      this.onLabelCreationPending(response.content.task_id);
    };

    this.onLabelCreationPending = (taskId, response) => {
      if (!response || response.content && response.content.progress && response.content.progress.running) {
        return $timeout(() => CommonUi.modal.action.check(taskId), response && 3000 || 0);
      }

      if (response.status !== 'OK' || typeof response.status === 'number') {
        this.errors = response.messages;
        return CommonUi.modal.close();
      }

      CommonUi.modal.data.isBusy = false;
      CommonUi.modal.data.downloads = response.content && response.content.download_result && response.content.download_result.download_urls;
    };
  }
];
