module.exports = [
  'CommonRequest',
  function(
    CommonRequest
  ) {
    'use strict';

    var self = this;

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

    self.selectedMethod = null;

    self.selectedRate = null;

    self.successful = null;

    self.downloads = null;

    /**
     * This public object holds the possible
     * error that may comes with the request.
     * @type {Object}
     */
    self.error = false;

    var requestParameters = {
      tracking_number: null,
      selected_rate_code: null,
      payment_method: null,
      iban: null,
      bic: null
    };

    self.start = function(trackingId, callback) {
      requestParameters.tracking_number = trackingId;
      requestParameters.selected_rate_code = self.selectedRate.code;
      requestParameters.payment_method = self.selectedMethod;

      if (self.methods[self.selectedMethod].data) {
        requestParameters.iban = self.methods[self.selectedMethod].data.iban;
        requestParameters.bic = self.methods[self.selectedMethod].data.bic;
      }

      doRequest(callback);
    };

    var doRequest = function(callback) {
      CommonRequest.transaction.start({
        parameters: requestParameters
      }, function(response) {
        if (response && response.content) {
          openPopup(response.content, callback);
        }
      }, function(error) {
        self.error = error;
      });
    };

    var openPopup = function(responseContent, callback) {
      if (responseContent.redirect_url) {
        var popup = window.open('/wait.html', '', 'width=' + (screen.availWidth * 0.8) + ',height=' + (screen.availHeight * 0.8) + ',resizable=yes');

        if (popup) {
          popup.moveTo(screen.availWidth * 0.1, screen.availHeight * 0.1);
          popup.focus();
          popup.location.href = responseContent.redirect_url;
        }

        var sendMessage = window.setInterval(function() {
          popup.postMessage('COUREON', '*');
        }, 100);

        var receiveMessage = function(e) {
          console.log('message');
          if (e.data.origin !== 'COUREON') {
            return;
          }
          if (e.data.data && e.data.data.messages && e.data.data.messages.length && e.data.data.messages[0].text) {
            console.log('error');
            self.successful = false;
          }
          if (e.data.data && e.data.data.status === 'OK') {
            console.log('success');
            console.log(e);
            self.successful = true;
            self.downloads = e.data.data.content.result;
          }
          console.log(responseContent);

          callback(self.successful, self.downloads);

          resume();
        };

        var resume = function(e) {
          window.clearInterval(sendMessage);
          window.removeEventListener('message', receiveMessage);
          window.removeEventListener('focus', resume);

          if (popup) {
            popup.close();
          }
        };

        window.addEventListener('message', receiveMessage, false);
        window.addEventListener('focus', resume);

        self.successful = false;
      }
    };

    return self;
  }
];
