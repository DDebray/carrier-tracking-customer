module.exports = function() {
  'use strict';

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
};
