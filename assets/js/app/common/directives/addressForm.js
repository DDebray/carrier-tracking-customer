module.exports = function(StorageCountries) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      model: '&addressModel',
      config: '&addressForm',
      reference: '&reference',
      receiver: '&receiver'
    },
    templateUrl: function(element, attrs) {
      return '/views/partials/address/' + (attrs.template || 'address_form.html');
    },
    link: function(scope) {
      var config = scope.config();

      scope.countryList = null;

      StorageCountries.load(function(countries) {
        scope.countryList = countries;
      });

      scope.form = {
        data: config.model ? config.model() : (config.data || {}),
        model: scope.model ? scope.model() : null,
        updateOn: config.updateOn || 'change blur',
        submit: angular.extend({
          label: '[please provide a label]',
          action: function() {
            alert('[please provide an action]');
          }
        }, config.submit),
        onChange: config.onChange || function() {},
        usePlaceholders: config.usePlaceholders || false,
        labels: config.labels || {},
        hide: config.hide || {},
        readonly: config.readonly || {},
        flags: config.flags || {},
        countryList: scope.countryList,
        autoComplete: config.autoComplete,
        required: angular.extend({
          name: function() {
            return true;
          },
          company: function() {
            return false;
          },
          street1: function() {
            return true;
          },
          street_no: function() {
            return true;
          },
          street2: function() {
            return false;
          },
          postal_code: function() {
            return ((scope.countryList || []).filter(function(country) {
              return country.code === scope.form.data.country;
            })[0] || {}).needsZipCode;
          },
          city: function() {
            return true;
          },
          country: function() {
            return true;
          },
          phone: function() {
            return !scope.receiver();
          },
          email: function() {
            return false;
          },
          marketplace_order_id: function() {
            return false;
          }
        }, config.required)
      };

      if (scope.reference()) {
        scope.reference()(scope.form);
      }

      if (scope.model()) {
        scope.form.data = scope.model();
      }

      scope.$watch('countryList', function(newCountryList) {
        scope.form.countryList = newCountryList;
      });

      scope.$watch('model()', function(model) {
        if (model) {
          scope.form.data = model;
        }
      });
    }
  };
};
