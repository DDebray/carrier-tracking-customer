module.exports = function ( application ) {
  'use strict';

  application
    .filter( 'reverse', function () {
      return function ( items ) {
        if ( items ) {
          // TODO this slice creates a copy of the original array.
          // That should not be necessary here.
          return items.slice().reverse();
        } else {
          return items;
        }
      };
    } )
    .filter( 'raw', [ '$sce', function ( $sce ) {
      return function ( val ) {
        return $sce.trustAsHtml( val );
      };
    } ] )
    .filter( 'jsonParse', function () {
      return function ( input ) {
        return JSON.parse( input );
      };
    } );
};
