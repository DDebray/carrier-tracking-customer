module.exports = function(application) {
  'use strict';

  application
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
    ;
};
