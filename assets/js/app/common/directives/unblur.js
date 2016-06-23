module.exports = function($timeout) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      el: '=unblur',
    },
    template: function(element) {
      var tag = element[0].nodeName;
      return '<' + tag + ' data-ng-style="style"></' + tag + '>';
    },
    transclude: true,
    replace: true,
    controller: function( $scope ) {
      $scope.style = {
        position : 'relative',
        display : 'none',
        height : '1px'
      };
    },
    link: function(scope, element, attrs) {
      var targetElem = document.getElementById(scope.el),
        placeholder = element,
        isPlaceholderVisible = false,
        isWatching = 0;

      scope.$watch(function() {
        return targetElem.offsetHeight;
      }, function(newValue, oldValue) {

        if (isPlaceholderVisible) {
          oldValue = oldValue - 1;
          newValue = newValue - 1;
        }

        if (newValue !== oldValue && isWatching < 2) {
          var remainder = newValue % 2;

          if (remainder === 1) {
            scope.style.display = 'block';
          } else {
            scope.style.display = 'none';
          }

          isPlaceholderVisible = scope.style.display === 'block';
          isWatching++;
        }

        $timeout(function () {
          isWatching = 0;
        }, 25);

      }, false); //ADD A BOOLEAN TO DEEPWATCH ALL THE PROPERTIES OF THE OBJECT

    }
  };
};
