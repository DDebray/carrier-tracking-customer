module.exports = function(application) {
  'use strict';

  application
    .directive('stopPropagation', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind(attr.stopPropagation, function(e) {
            e.stopPropagation();
          });
        }
      };
    })
    .directive('preventDefault', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind(attr.preventDefault, function(e) {
            e.preventDefault();
          });
        }
      };
    })
    .directive('autofocus', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, elements) {
          $timeout(function() {
            elements[0].focus();
          }, 300);
        }
      };
    }])
    .directive('selectOnClick', ['$window', function($window) {
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
    }])
    ;
};
