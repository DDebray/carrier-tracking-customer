module.exports = function($timeout) {
  'use strict';

  return {
    scope: {
      getValues: '&watchHeight',
    },
    link: function(scope, element, attrs) {
      var config = scope.getValues(),
        action = function(condition) {
          var targetOnTrue = element[0].querySelector(config.targetOnTrue),
            targetOnFalse = element[0].querySelector(config.targetOnFalse),
            target = condition ? targetOnTrue : targetOnFalse;
            element.css('height', target.offsetHeight + 'px');
        };

      $timeout(function() {
        element.addClass( config.disableAnimationClass );
        action(config.condition);
      }, 25);

      $timeout(function() {
        element.removeClass( config.disableAnimationClass );
      }, 800);

      scope.$watch('getValues().condition', action);
    }
  };
};
