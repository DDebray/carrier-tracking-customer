module.exports = function($timeout, $window) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element) {

      var pixels,
        w = angular.element($window),
        el = element[0],
        h = $window.innerHeight;

      function calculateMargin() {
        pixels = Math.round((h - el.clientHeight) / 2);
        pixels = (pixels < 100) ? '100px' : (pixels + 'px');

        element.css('margin-top', pixels);
      }

      $timeout(function() {
        calculateMargin();
      }, 20);

      $timeout(function() {
        calculateMargin();
      }, 500);

      w.bind('resize', function() {
        h = $window.innerHeight;
        calculateMargin();
      });

    }
  };
};
