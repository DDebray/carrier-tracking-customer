module.exports = ['$resource', '$http', 'CommonConfig', function($resource, $http, CommonConfig) {
  'use strict';

  var generateResource = function(route, endpoint, paramDefaults, actions, options) {
    if (actions) {

      console.log('CommonConfig.endpoints', CommonConfig.endpoints);
      console.log('CommonConfig.environment()', CommonConfig.environment());

      angular.forEach(actions, function(action) {
        action.url = CommonConfig.endpoints[endpoint][CommonConfig.environment()] + action.url;
      });
    }

    return $resource((endpoint ? CommonConfig.endpoints[endpoint][CommonConfig.environment()] : '/') + route, paramDefaults, actions, options);
  };

  $http.defaults.headers.common.env = 'production'; // todo: hard coded
  $http.defaults.headers.common.locale = 'de-DE'; // todo: hard coded - COUREON-347

  return {
    // baseConfig : generateResource('configs/base', 'ui'),
    dashboard : generateResource('dashboard', 'ui'),
    tracking : generateResource('tracking', 'ui', null, {
      getStatus : {
        method : 'GET',
        url : 'tracking/:trackingId'
      }
    }),
    cms : {
      news : generateResource('news', 'cms'),
      cooperations : generateResource('cooperations', 'cms')
    },
    setToken : function(token) {
      $http.defaults.headers.common.token = token;
    }
  };
}];
