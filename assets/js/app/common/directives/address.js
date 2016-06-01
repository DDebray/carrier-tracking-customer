module.exports = function(/*StorageCountries*/) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      data: '&data',
      isEditable: '&isEditable'
    },
    templateUrl: function(element, attrs) {
      return '/views/partials/address/' + (attrs.template || 'address.html');
    },
    link: function(scope) {
      var countryList = null;

      // StorageCountries.load(function(countries) {
      //   countryList = countries;
      // });
      countryList = [{
        code : 'DE',
        name : 'Deutschland',
        needsZipCode : false
      },{
        code : 'US',
        name : 'Vereinigte Staaten',
        needsZipCode : true
      }];

      scope.address = {
        data: scope.data(),
        isEditable: scope.isEditable(),
        getCountry: function(countryCode) {
          return countryList ? (countryList.filter(function(country) {
            return country.code === countryCode;
          })[0] || {}) : {
            name: countryCode
          };
        }
      };

      scope.$watch('data()', function(newData) {
        scope.address.data = newData;
      });
      scope.$watch('isEditable()', function(newIsEditable) {
        scope.address.isEditable = newIsEditable;
      });
    }
  };
};
