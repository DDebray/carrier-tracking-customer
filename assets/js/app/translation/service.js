module.exports = ['$q', '$http', function ($q, $http) {
  'use strict';

  return function (options) {
    var deferred = $q.defer();

    $http.get(options.url + options.key, {})
      .success(function (data) {
        deferred.resolve(data && data.content && data.content.translations ? data.content.translations : {});
      }).error(function () {
        var essentials = require('./essentials');
        if (essentials[options.key]) {
          deferred.resolve(essentials[options.key]);
        } else {
          deferred.reject(options.key);
        }
      });

    return deferred.promise;
  };
}];