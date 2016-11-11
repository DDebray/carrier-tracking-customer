module.exports = [
  '$q', 'CommonUi', 'CommonRequest', 'CommonPopups',
  function (
    $q, CommonUi, CommonRequest, CommonPopups
  ) {
    'use strict';

    var self = this,

      /**
       * This private object holds the
       * possible request parameters.
       * @type {Object}
       */
      requestParameters = {
        updated_address: null,
        tracking_number: null,
        postal_code_for_verification: null,
        selected_rate_code: null,
        payment_method: null,
        iban: null,
        bic: null
      };

    /**
     * This public object holds
     * the selected rate.
     * @type {[type]}
     */
    self.selectedRate = null;

    /**
     * This public object holds
     * the selected payment method.
     * @type {[type]}
     */
    self.selectedMethod = null;

    /**
     * This public method holds the information
     * of all possible payment method.
     * @type {Object}
     */
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

    /**
     * This public object holds the callback
     * for the comming popup events.
     * @type {Object}
     */
    self.transactionCallback = null;

    /**
     * This function opens the popup for the payment process
     * and starts the transaction.
     * @param  {String} trackingId a string holding the tracking number.
     */
    self.start = function ( trackingId, postalCodeForVerification ) {
      if ( !self.transactionCallback ) {
        return;
      }

      requestParameters.updated_address = self.updatedAddress;
      requestParameters.selected_rate_code = self.selectedRate.code;
      requestParameters.payment_method = self.selectedMethod;
      requestParameters.tracking_number = trackingId;
      requestParameters.postal_code_for_verification = postalCodeForVerification;

      if ( self.methods[ self.selectedMethod ].data ) {
        requestParameters.iban = self.methods[ self.selectedMethod ].data.iban;
        requestParameters.bic = self.methods[ self.selectedMethod ].data.bic;
      }

      openPopup();
    };

    /**
     * This function handles all popup related actions.
     */
    var openPopup = function () {

      var newPopupFactory,
        popupPromise = $q.resolve();

      newPopupFactory = CommonPopups();
      popupPromise = newPopupFactory.prepare();

      popupPromise.then(
        // POPUP SUCCESSFULLY OPENED
        function () {
          CommonRequest.transaction.start( {
              parameters: requestParameters
            },
            // START TRANSACTION REQUEST WAS SUCCESSFULL
            function ( response ) {
              ( newPopupFactory ? newPopupFactory.proceed( ( response.content || {} ).redirect_url ) : $q.resolve() ).then(
                // PAYMENT PROCESS WAS SUCCESSFULL
                function ( response ) {
                  var downloads = {};
                  if ( response.data.data.content ) {
                    downloads = response.data.data.content.result;
                  } else {
                    console.log( 'TODO: check PayPal data', response.data.data );
                  }
                  self.transactionCallback( false, null, downloads );
                },
                // PAYMENT PROCESS WAS NOT SUCCESSFULL
                function ( error ) {
                  // Popup was closed or lost focus
                  if ( newPopupFactory ) {
                    newPopupFactory.proceed( false );
                  }
                  if ( response ) {
                    self.transactionCallback( true, ( response.messages.length > 0 ) ? response.messages : false );
                  }
                }
              );

            },
            // START TRANSACTION REQUEST WAS NOT SUCCESSFULL
            function ( error ) {
              self.transactionCallback( true );
            } );
        },
        // POPUP NOT SUCCESSFULLY OPENED
        function () {
          self.transactionCallback( true );
        } );
    };

    return self;
  }
];
