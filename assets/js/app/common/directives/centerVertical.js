module.exports = function($parse, $timeout, $window) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      getValues: '&centerVertical'
    },
    link: function(scope, element, attrs) {
      var config = {},
        updateConfig = function() {
          config = scope.getValues();
        };
      updateConfig();

      if (!config) {
        return;
      }

      console.log('config', config);

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

      scope.$watch('getValues().redraw', function (flag) {
        if(flag){
          console.log('redraw...');
          $timeout(function() {
            calculateMargin();
          }, 100);
        }
      });
    }
  };
};
