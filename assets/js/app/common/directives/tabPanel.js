module.exports = function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/views/partials/tab_panel.html',
    scope: {},
    bindToController: true,
    controllerAs: 'tabPanel',
    controller: function () {
      var self = this;
      self.tabs = [];
      self.addTab = function addTab( tab ) {
        self.tabs.push( tab );
        if ( self.tabs.length === 1 ) {
          tab.active = true;
        }
      };
      self.select = function ( selectedTab ) {
        angular.forEach( self.tabs, function ( tab ) {
          if ( tab.active && tab !== selectedTab ) {
            tab.active = false;
          }
        } );
        selectedTab.active = true;
      };
    },
    link: function ( scope, element, attr ) {
      scope.padding = 'padding' in attr;
    }
  };
};
