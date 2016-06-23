module.exports = function CommonUiProvider() {
  'use strict';

  var self = this,
    services = {};

  self.$get = ['$rootScope', '$filter', '$timeout', 'CommonBrowser', function($rootScope, $filter, $timeout, CommonBrowser) {
    services.$scope = $rootScope;
    services.CommonBrowser = CommonBrowser;
    services.$filter = $filter;
    services.$timeout = $timeout;
    return self;
  }];

  self.locked = false;

  self.lock = function() {
    self.locked = true;
    self.busy = true;
  };

  self.unlock = function() {
    self.locked = false;
    self.busy = false;
  };

  self.busy = false;

  self.hidden = false;

  self.tooltip = {
    config : null,
    hide : function() {
      self.tooltip.config = null;
      if(services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }

      angular.element(window).off('resize', this.updatePosition);
    },
    show : function(config) {
      if (!config || !config.targetEl || !config.targetEl.offsetParent) {
        return;
      }

      self.tooltip.config = config;
      this.updatePosition();

      if(services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }

      angular.element(window).off('resize', this.updatePosition).on('resize', this.updatePosition);
    },
    updatePosition : function(apply) {
      var config = self.tooltip.config;
      if (!config.targetEl || !config.targetEl.offsetParent) {
        return self.tooltip.hide();
      }

      var acr = services.CommonBrowser.getAbsoluteClientRect(config.targetEl),
        directionX = config.directionX || 'centered',
        directionY = config.directionY || (acr.fixed.bottom > (document.body.clientHeight - 200) ? 'up' : 'down');
      config.cssClass = 'ui-tooltip--' + directionY + ' ' + 'ui-tooltip--' + directionX + ' ' + (config.class || '');
      config.css = {
        minWidth : acr.width + 'px',
        top : directionY === 'down' ? (acr.bottom + 'px') : 'auto',
        bottom : directionY === 'up' ? ((document.body.clientHeight - acr.top) + 'px') : 'auto',
        left : directionX === 'centered' ? (acr.left + (acr.width / 2)) + 'px' : (directionX === 'right' ? (acr.left + (acr.width / 2) - 25) + 'px' : 'auto'),
        right : directionX === 'left' ? (((document.body.clientWidth - acr.right) + (acr.width / 2)) - 9) + 'px' : 'auto'
      };

      if(apply && services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }
    }
  };

  self.modal = {
    template : null,
    data : null,
    closable : true,
    onClose : null,
    action : null,
    hide : function() {
      if (!this && !self.modal.closable) {
        // triggered by hotkey & modal not closable
        return;
      }

      (self.modal.onClose || function(){})();

      self.modal.template = null;
      self.modal.data = null;
      self.modal.onClose = null;
      self.modal.action = null;
    },
    show : function(template, closable, data, onClose, action) {
      (this.onClose || function(){})();

      this.template = template;
      this.closable = typeof closable === 'boolean' ? closable : true;
      this.data = data;
      this.onClose = onClose;
      this.action = action;
    }
  };
};
