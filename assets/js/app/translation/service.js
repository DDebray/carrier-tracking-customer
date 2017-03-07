module.exports = [ '$q', '$http', function ( $q, $http ) {
  'use strict';

  return function ( options ) {
    var deferred = $q.defer();

    $http.get( options.url + options.key, {} ).then(
      function ( success ) {
        deferred.resolve( success.data && success.data.content && success.data.content.translations ? success.data.content.translations : {} );
      },
      function ( error ) {
        var essentials = require( './essentials' );
        if ( essentials[ options.key ] ) {
          deferred.resolve( essentials[ options.key ] );
        } else {
          deferred.reject( options.key );
        }
      } );

    return deferred.promise;
  };
} ];
