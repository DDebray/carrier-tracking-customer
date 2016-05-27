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
                console.log('enter');
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
    ;
};
