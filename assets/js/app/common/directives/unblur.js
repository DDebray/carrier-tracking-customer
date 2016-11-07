module.exports = function ( $timeout, $window ) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      el: '=unblur',
    },
    template: function ( element ) {
      var tag = element[ 0 ].nodeName;
      return '<' + tag + ' data-ng-style="style"></' + tag + '>';
    },
    transclude: true,
    replace: true,
    controller: [ '$scope', function ( $scope ) {
      $scope.style = {
        position: 'relative',
        display: 'none',
        height: '1px'
      };
    } ],
    link: function ( scope, element, attrs ) {

      var targetElem = document.getElementById( scope.el ),
        isPlaceholderVisible = false;

      scope.contentHeight = function () {
        return targetElem.offsetHeight;
      };

      scope.$watch( scope.contentHeight, function ( newValue, oldValue ) {
        if ( isPlaceholderVisible ) {
          oldValue = oldValue - 1;
          newValue = newValue - 1;
        }

        if ( newValue !== oldValue ) {
          var remainder = newValue % 2;

          if ( remainder === 1 ) {
            scope.style.display = 'none';
          } else {
            scope.style.display = 'block';
          }

          isPlaceholderVisible = scope.style.display === 'block';
        }

        angular.element( $window ).bind( 'resize', function () {
          scope.$apply();
        } );

      }, false );
    }
  };
};
