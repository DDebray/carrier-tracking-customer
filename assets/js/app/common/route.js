module.exports = ['$routeProvider', '$locationProvider', '$httpProvider', 'CommonConfigProvider', 'CommonUiProvider', function($routeProvider, $locationProvider, $httpProvider, CommonConfig, CommonUi) {
  'use strict';

  var needsToBeLoggedIn = false;
  var loggedInResolver = {
    load : ['$q', 'CommonUser', function($q, CommonUser) {
      needsToBeLoggedIn = true;

      var defer = $q.defer();

      switch (CommonUser.get().state) {
        case 'LOGGED_IN':
          defer.resolve();
          break;
        case 'LOGGING_IN':
          defer.resolve();
          break;
        default:
          defer.reject('NOT_LOGGED_IN');
      }

      return defer.promise;
    }]
  };
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
      templateUrl : 'views/dashboard.html',
      controller : 'PageDashboardCtrl as dashboard',
      resolve : loggedInResolver,
      navigation : 'dashboard'
    })
    .when('/www', {
        controller: function() {
            window.location.replace(CommonConfig.endpoints.www[CommonConfig.environment()]);
        },
        template : '<br /><br />',
        resolve : independentPageResolver
    })
    .when('/static', {
      controller : function() {
        window.location.replace(CommonConfig.endpoints.static[CommonConfig.environment()]);
      },
      template : '<br /><br />',
      resolve : independentPageResolver
    })
    .when('/demo', {
      template : '',
      controller : 'PageDemoCtrl as demo',
      resolve : independentPageResolver,
      navigation : 'demo'
    })
    .when('/login', {
      templateUrl : 'views/login.html',
      controller : 'PageLoginCtrl as login',
      resolve : independentPageResolver,
      navigation : 'login'
    })
    .when('/login/:token', {
      controller : 'PageLoginCtrl as login',
      template : '',
      resolve : independentPageResolver,
      navigation : 'login'
    })
    .when('/forgot_password', {
      controller : 'PageForgotPasswordCtrl as forgotPassword',
      templateUrl : 'views/forgot_password.html',
      resolve : independentPageResolver,
      navigation : 'forgot_password'
    })
    .when('/forgot_password/:hash', {
      controller : 'PageForgotPasswordCtrl as forgotPassword',
      templateUrl : 'views/forgot_password.html',
      resolve : independentPageResolver,
      navigation : 'forgot_password'
    })
    .when('/label/print/batch', {
      templateUrl : 'views/label_print_batch.html',
      controller : 'PageLabelPrintBatchCtrl as labelPrintBatch',
      resolve : loggedInResolver,
      navigation : 'label_print_batch'
    })
    .when('/shipments/customs/:shipmentIds', {
      templateUrl : 'views/customs.html',
      controller : 'PageCustomsCtrl as customs',
      resolve : loggedInResolver,
      navigation : 'customs'
    })
    .when('/shipments/picklist/:taskId', {
      templateUrl : 'views/picklist.html',
      controller : 'PagePicklistCtrl as picklist',
      resolve : loggedInResolver,
      navigation : 'picklist'
    })
    .when('/shipments/completed', {
      templateUrl : 'views/shipments_completed.html',
      controller : 'PageShipmentsCompletedCtrl as shipmentsCompleted',
      resolve : loggedInResolver,
      navigation : 'shipments_completed'
    })
    .when('/label/print/one', {
      templateUrl : 'views/label_print_one.html',
      controller : 'PageLabelPrintOneCtrl as labelPrintOne',
      resolve : loggedInResolver,
      navigation : 'label_print_one'
    })
    .when('/label/print/one/:shipmentId/:packageId', {
      templateUrl : 'views/label_print_one.html',
      controller : 'PageLabelPrintOneCtrl as labelPrintOne',
      resolve : loggedInResolver,
      navigation : 'label_print_one'
    })
    .when('/shipments/import', {
      templateUrl : 'views/shipments_import.html',
      controller : 'PageShipmentsImportCtrl as shipmentsImport',
      resolve : loggedInResolver,
      navigation : 'shipments_import'
    })
    .when('/calculator/price', {
      templateUrl : 'views/calculator_price.html',
      controller : 'PageCalculatorPriceCtrl as calculatorPrice',
      resolve : loggedInResolver,
      navigation : 'calculator_price'
    })
    .when('/personal_data', {
      templateUrl : 'views/addresses.html',
      controller : 'PageAddressesCtrl as addresses',
      resolve : loggedInResolver,
      navigation : 'personal_data'
    })
    .when('/billing', {
      templateUrl : 'views/billing.html',
      controller : 'PageBillingCtrl as billing',
      resolve : loggedInResolver,
      navigation : 'billing'
    })
    .when('/shops', {
      templateUrl : 'views/shops.html',
      controller : 'PageShopsCtrl as shops',
      resolve : loggedInResolver,
      navigation : 'shops'
    })
    .when('/package/sizes', {
      templateUrl : 'views/package_sizes.html',
      controller : 'PagePackageSizesCtrl as packageSizes',
      resolve : loggedInResolver,
      navigation : 'package_sizes'
    })
    .when('/carriers', {
      templateUrl : 'views/carriers.html',
      controller : 'PageCarriersCtrl as carriers',
      resolve : loggedInResolver,
      navigation : 'carriers'
    })
    .when('/recommendations', {
      templateUrl : 'views/recommendations.html',
      controller : 'PageRecommendationsCtrl as recommendations',
      resolve : loggedInResolver,
      navigation : 'recommendations'
    })
    .when('/cooperations', {
      templateUrl : 'views/cooperations.html',
      controller : 'PageCooperationsCtrl as cooperations',
      resolve : loggedInResolver,
      navigation : 'cooperations'
    })
    .when('/register', {
      templateUrl : 'views/register.html',
      controller : 'PageRegisterCtrl as register',
      resolve : independentPageResolver,
      navigation : 'register'
    })
    .when('/register/:email', {
      controller : 'PageRegisterCtrl as register',
      template : '',
      resolve : independentPageResolver,
      navigation : 'register'
    })
    .when('/setup', {
      templateUrl : 'views/setup.html',
      controller : 'PageSetupCtrl as setup',
      resolve : loggedInResolver,
      navigation : 'setup'
    })
    .when('/guide/:guideEntry', {
      templateUrl : 'views/guide.html',
      controller : 'PageGuideCtrl as guide',
      resolve : independentPageResolver
    })
    .when('/logout', {
      template : '',
      controller : 'PageLogoutCtrl',
      resolve : independentPageResolver,
      navigation : 'logout'
    })
    .otherwise({
      redirectTo : '/'
    });
}];
