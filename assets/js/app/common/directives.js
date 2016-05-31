module.exports = function(application) {
  'use strict';

  application
    .directive('list', function() {
      return {
        restrict: 'E',
        scope: {
          list: '=model',
        },
        replace: true,
        transclude: true,
        templateUrl: '/views/partials/list.html'
      };
    })
    .directive('tabPanel', function() {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: '/views/partials/tab_panel.html',
        scope: {},
        bindToController: true,
        controllerAs: 'tabPanel',
        controller: function() {
          var self = this;
          self.tabs = [];
          self.addTab = function addTab(tab) {
            self.tabs.push(tab);
            if(self.tabs.length === 1) {
              tab.active = true;
            }
          };
          self.select = function(selectedTab) {
            angular.forEach(self.tabs, function(tab) {
              if(tab.active && tab !== selectedTab) {
                tab.active = false;
              }
            });
            selectedTab.active = true;
          };
        },
        link: function(scope, element, attr) {
          scope.padding = 'padding' in attr;
        }
      };
    })
    .directive('tab', function() {
      return {
        restrict: 'E',
        transclude: true,
        template: '<div ng-show="active" ng-transclude></div>',
        replace: true,
        require: '^tabPanel',
        scope: {
          name: '@name'
        },
        link: function(scope, element, attr, tabPanelCtrl) {
          scope.active = false;
          tabPanelCtrl.addTab(scope);
        }
      };
    })
    .directive('banner', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@title',
          subtitle: '@subtitle'
        },
        transclude: true,
        replace: true,
        templateUrl: '/views/partials/banner.html'
      };
    })
    .directive('hero', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@title',
          image: '@image'
        },
        transclude: true,
        replace: true,
        templateUrl: '/views/partials/hero.html'
      };
    })
    .directive('stopPropagation', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind(attr.stopPropagation, function(e) {
            e.stopPropagation();
          });
        }
      };
    })
    .directive('preventDefault', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind(attr.preventDefault, function(e) {
            e.preventDefault();
          });
        }
      };
    })
    .directive('autofocus', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, elements) {
          $timeout(function() {
            elements[0].focus();
          }, 300);
        }
      };
    }])
    .directive('selectOnClick', ['$window', function($window) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.on('click', function() {
            if (!$window.getSelection().toString()) {
              this.setSelectionRange(0, this.value.length);
            }
          });
        }
      };
    }])
    .directive('tooltip', ['CommonUi', function(CommonUi) {
      return {
        restrict: 'A',
        scope: {
          getValues: '&tooltip'
        },
        link: function(scope, elements) {
          var config = {},
            updateConfig = function() {
              config = scope.getValues();
              (config || {}).targetEl = elements[0];
            };
          updateConfig();

          if (!config) {
            return;
          }

          switch (config.on) {
            case 'enter':
              elements.on('mouseenter', function() {
                updateConfig();
                CommonUi.tooltip.show(config);
              });

              elements.on('mouseleave', function() {
                CommonUi.tooltip.hide();
              });
              break;
            case 'click':
              elements.on('click', function() {
                if (!CommonUi.tooltip.config || CommonUi.tooltip.config.targetEl !== config.targetEl) {
                  updateConfig();
                  CommonUi.tooltip.show(config);
                } else {
                  CommonUi.tooltip.hide();
                }
              });
              break;
          }

          if (typeof config.onTrue !== 'undefined') {
            scope.$watch('getValues().onTrue', function(newVal) {
              if (newVal) {
                updateConfig();
                CommonUi.tooltip.show(config);
              } else {
                CommonUi.tooltip.hide();
              }
            });
          }

          scope.$on('$destroy', function() {
            if (CommonUi.tooltip.config && CommonUi.tooltip.config.targetEl === config.targetEl) {
              CommonUi.tooltip.hide();
            }
          });
        }
      };
    }])

    .directive('address', [/*'StorageCountries',*/ function(StorageCountries) {
      return {
        restrict: 'E',
        scope: {
          data: '&data',
          isEditable: '&isEditable'
        },
        templateUrl: function(element, attrs) {
          return '/views/partials/address/' + (attrs.template || 'address.html');
        },
        link: function(scope) {
          var countryList = null;

          // StorageCountries.load(function(countries) {
          //   countryList = countries;
          // });

          countryList = [{
            code : 'DE',
            name : 'Deutschland',
            needsZipCode : false
          },{
            code : 'US',
            name : 'Vereinigte Staaten',
            needsZipCode : true
          }];


          scope.address = {
            data: scope.data(),
            isEditable: scope.isEditable(),
            getCountry: function(countryCode) {
              return countryList ? (countryList.filter(function(country) {
                return country.code === countryCode;
              })[0] || {}) : {
                name: countryCode
              };
            }
          };

          scope.$watch('data()', function(newData) {
            scope.address.data = newData;
          });
          scope.$watch('isEditable()', function(newIsEditable) {
            scope.address.isEditable = newIsEditable;
          });
        }
      };
    }])
    .directive('addressForm', [/*'StorageCountries', */function(StorageCountries) {
      return {
        restrict: 'A',
        scope: {
          model: '&addressModel',
          config: '&addressForm',
          reference: '&reference',
          receiver: '&receiver'
        },
        templateUrl: function(element, attrs) {
          return '/views/partials/address/' + (attrs.template || 'address_form.html');
        },
        link: function(scope) {
          var config = scope.config();

          scope.countryList = null;
          // StorageCountries.load(function(countries) {
          //   scope.countryList = countries;
          // });
          scope.countryList = [{
            code : 'DE',
            name : 'Deutschland',
            needsZipCode : false
          },{
            code : 'US',
            name : 'Vereinigte Staaten',
            needsZipCode : true
          }];


          scope.form = {
            data: config.model ? config.model() : (config.data || {}),
            model: scope.model ? scope.model() : null,
            updateOn: config.updateOn || 'change blur',
            submit: angular.extend({
              label: '[please provide a label]',
              action: function() {
                alert('[please provide an action]');
              }
            }, config.submit),
            onChange: config.onChange || function() {},
            usePlaceholders: config.usePlaceholders || false,
            labels: config.labels || {},
            hide: config.hide || {},
            readonly: config.readonly || {},
            flags: config.flags || {},
            countryList: scope.countryList,
            autoComplete: config.autoComplete,
            required: angular.extend({
              name: function() {
                return true;
              },
              company: function() {
                return false;
              },
              street1: function() {
                return true;
              },
              street_no: function() {
                return true;
              },
              street2: function() {
                return false;
              },
              postal_code: function() {
                return ((scope.countryList || []).filter(function(country) {
                  return country.code === scope.form.data.country;
                })[0] || {}).needsZipCode;
              },
              city: function() {
                return true;
              },
              country: function() {
                return true;
              },
              phone: function() {
                return !scope.receiver();
              },
              email: function() {
                return false;
              },
              marketplace_order_id: function() {
                return false;
              }
            }, config.required)
          };

          if (scope.reference()) {
            scope.reference()(scope.form);
          }

          if (scope.model()) {
            scope.form.data = scope.model();
          }

          scope.$watch('countryList', function(newCountryList) {
            scope.form.countryList = newCountryList;
          });

          scope.$watch('model()', function(model) {
            if (model) {
              scope.form.data = model;
            }
          });
        }
      };
    }])
    ;
};
