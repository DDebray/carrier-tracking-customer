module.exports = function($window) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function() {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length);
        }
      });
    }
  };
};
