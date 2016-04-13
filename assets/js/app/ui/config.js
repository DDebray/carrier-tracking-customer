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
    },
    showGeneric : function(headlineKey, textKey, showSpinner, isClosable) {
      isClosable = isClosable === undefined ? true : isClosable;

      this.show('/views/partials/modal_generic.html', isClosable, {
        headline : headlineKey,
        text : textKey,
        showSpinner : showSpinner
      });
    }
  };
};
