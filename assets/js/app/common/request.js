module.exports = ['$resource', '$http', 'CommonConfig', function($resource, $http, CommonConfig) {
  'use strict';

  var generateResource = function(route, endpoint, paramDefaults, actions, options) {
    if (actions) {
      angular.forEach(actions, function(action) {
        action.url = CommonConfig.endpoints[endpoint][CommonConfig.environment()] + action.url;
      });
    }

    return $resource((endpoint ? CommonConfig.endpoints[endpoint][CommonConfig.environment()] : '/') + route, paramDefaults, actions, options);
  };

  $http.defaults.headers.common.env = 'production'; // todo: hard coded
  $http.defaults.headers.common.locale = 'de-DE'; // todo: hard coded - COUREON-347

  return {
    countries : generateResource('countries', 'cx'),
    shipment: generateResource('shipment', 'cx'),
    tracking : generateResource('tracking', 'cx', null, {
      getStatus : {
        method : 'GET',
        url : 'tracking/:trackingId'
      }
    }),
    externalTracking : generateResource('tracking', 'ruediger', null, {
      getStatus : {
        method : 'GET',
        url : 'tracking/:trackingId'
      }
    }),
    cms : {
      news : generateResource('news', 'cms'),
      cooperations : generateResource('cooperations', 'cms')
    }
  };
}];
