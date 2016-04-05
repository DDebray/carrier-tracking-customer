module.exports = ['$routeProvider', '$locationProvider', '$httpProvider', 'CommonConfigProvider', 'CommonUiProvider', function($routeProvider, $locationProvider, $httpProvider, CommonConfig, CommonUi) {
  'use strict';

  var needsToBeLoggedIn = false;
  var independentPageResolver = function() {
    needsToBeLoggedIn = false;
  };

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push(['$q', '$location', '$translate', function($q, $location, $translate) {
    return {
      request : function(config) {
        CommonUi.busy = true;
        return config;
      },
      requestError : function(rejection) {
        return $q.reject(rejection);
      },
      response : function(response) {
        CommonUi.busy = false;
        return response;
      },
      responseError: function(rejection) {
        CommonUi.busy = false;

        if (rejection.status === 503) {
          window.setTimeout(function() {
            document.location.reload();
          }, 30000);
          CommonUi.modal.show('/views/partials/user/maintenance.html', false, null);
          return $q.reject(rejection);
        }

        if (rejection.data && rejection.data.messages && rejection.data.messages.length) {
          angular.forEach(rejection.data.messages, function(message) {
            CommonUi.notifications.autoRemove(CommonUi.notifications.add(message.type, message.text));
          });

          if (rejection.data.messages[0].key === 'api.access.denied') {
            if (needsToBeLoggedIn) {
              $location.path('/static');
            } else {
              CommonUi.notifications.reset();
            }
          }
        } else {
          $translate('MESSAGE.GENERIC.' + rejection.status).then(function(translation) {
            CommonUi.notifications.autoRemove(CommonUi.notifications.add('ERROR', translation));
          });
        }

        return $q.reject(rejection);
      }
    };
  }]);

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      controller : 'PageBaseCtrl as base',
      template : '',
      resolve : independentPageResolver,
    })
    .when('/:packageId', {
      controller : 'PageBaseCtrl as base',
      template : '',
      resolve : independentPageResolver,
    })
    .otherwise({
      redirectTo : '/'
    });
}];
