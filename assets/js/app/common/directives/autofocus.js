module.exports = function($timeout) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, elements) {
      $timeout(function() {
        elements[0].focus();
      }, 300);
    }
  };
};
