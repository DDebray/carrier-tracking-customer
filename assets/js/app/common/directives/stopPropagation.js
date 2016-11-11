module.exports = function () {
  'use strict';

  return {
    restrict: 'A',
    link: function ( scope, element, attr ) {
      element.bind( attr.stopPropagation, function ( e ) {
        e.stopPropagation();
      } );
    }
  };
};
