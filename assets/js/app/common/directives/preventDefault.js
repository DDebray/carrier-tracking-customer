module.exports = function() {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      element.bind(attr.preventDefault, function(e) {
        e.preventDefault();
      });
    }
  };
};
