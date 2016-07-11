module.exports = [
  '$q', 'CommonUi', 'CommonRequest', 'CommonPopups',
  function(
    $q, CommonUi, CommonRequest, CommonPopups
  ) {
    'use strict';

    var self = this,
      requestParameters = {
        tracking_number: null,
        selected_rate_code: null,
        payment_method: null,
        iban: null,
        bic: null
      };

    /**
    * This public object holds the possible
    * error that may comes with the request.
    * @type {Object}
    */
    self.error = false;
    self.selectedMethod = null;
    self.selectedRate = null;
    self.successful = null;
    self.downloads = null;
    self.methods = {
      CREDIT_CARD: {
        data: null
      },
      PAYPAL: {
        data: null
      },
      SOFORT_UEBERWEISUNG: {
        data: null
      }
    };

    self.start = function(trackingId, callback) {
      if (!callback) {
        return;
      }

      var popupPromise = $q.resolve(),
      newPopupFactory;

      requestParameters.tracking_number = trackingId;
      requestParameters.selected_rate_code = self.selectedRate.code;
      requestParameters.payment_method = self.selectedMethod;

      if (self.methods[self.selectedMethod].data) {
        requestParameters.iban = self.methods[self.selectedMethod].data.iban;
        requestParameters.bic = self.methods[self.selectedMethod].data.bic;

        newPopupFactory = CommonPopups();
        popupPromise = newPopupFactory.prepare();
      }

      popupPromise.then(function() {

        CommonRequest.transaction.start({
          parameters: requestParameters
        }, function(response) {

          (newPopupFactory ? newPopupFactory.proceed((response.content || {}).redirect_url) : $q.resolve()).then(function(response) {

            console.log('response', response);

            if (response.data.data.content) {
              self.successful = true;
              self.downloads = response.data.data.content.result;
            } else {
              console.log('TODO: check PayPal data', response.data.data);
              self.successful = false;
              self.error = true;
            }

            callback(self.successful, self.downloads);

          }, function (error) {
            // Popup was closed or lost focus
            if (newPopupFactory) {
              newPopupFactory.proceed(false);
            }
            self.error = error || true;
            callback(false);
          });

        }, function(error) {
          self.error = error;
          callback(false);
        });

      }, function () {
        console.log('popup promise got rejected');
      });
    };










    // var doRequest = function(callback) {
    //   CommonRequest.transaction.start({
    //     parameters: requestParameters
    //   }, function(response) {
    //     if (response && response.content) {
    //       openPopup(response.content, callback);
    //     }
    //   }, function(error) {
    //     self.error = error;
    //   });
    // };
    //
    // var openPopup = function(responseContent, callback) {
    //   if (responseContent.redirect_url) {
    //
    //     if (self.popup) {
    //       self.popup.moveTo(screen.availWidth * 0.1, screen.availHeight * 0.1);
    //       self.popup.focus();
    //       self.popup.location.href = responseContent.redirect_url;
    //     }
    //
    //     var sendMessage = window.setInterval(function() {
    //       self.popup.postMessage('COUREON', '*');
    //     }, 100);
    //
    //     var receiveMessage = function(e) {
    //       console.log('message');
    //       if (e.data.origin !== 'COUREON') {
    //         return;
    //       }
    //       if (e.data.data && e.data.data.messages && e.data.data.messages.length && e.data.data.messages[0].text) {
    //         console.log('receiveMessage > error: ', e.data.data.messages[0]);
    //         self.successful = false;
    //       }
    //       if (e.data.data && e.data.data.status === 'OK') {
    //         console.log('success');
    //         console.log(e);
    //         self.successful = true;
    //         self.downloads = e.data.data.content.result;
    //       }
    //       console.log(responseContent);
    //
    //       callback(self.successful, self.downloads);
    //
    //       resume();
    //     };
    //
    //     var resume = function(e) {
    //       window.clearInterval(sendMessage);
    //       window.removeEventListener('message', receiveMessage);
    //       window.removeEventListener('focus', resume);
    //
    //       if (self.popup) {
    //         self.popup.close();
    //       }
    //     };
    //
    //     window.addEventListener('message', receiveMessage, false);
    //     window.addEventListener('focus', resume);
    //
    //     self.successful = false;
    //   }
    // };

    return self;
  }
];
