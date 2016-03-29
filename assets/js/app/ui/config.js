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

  self.tasks = {};

  self.notifications = {
    items : {},
    assignSlot : function(key) {
      if (this.items[key]) {
        return this.assignSlot(key + 1);
      }

      return key;
    },
    add : function(type, message, clickHandler, url) {
      var key = this.assignSlot(64062313200000 - (new Date().getTime()));

      this.items[key] = {
        type : type.toLowerCase(),
        message : message,
        hidden : false,
        clickHandler : clickHandler,
        url : url
      };

      if(services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }

      return key;
    },
    hide : function(key) {
      if (this.items[key]) {
        this.items[key].hidden = true;
      }
    },
    remove : function(key) {
      if (this.items[key]) {
        delete this.items[key];
      }
    },
    reset : function() {
      this.items = {};
    },
    autoRemove : function(key, timeout) {
      if (!services.$timeout) {
        return;
      }

      services.$timeout(function() {
        self.notifications.hide(key);
      }, timeout || 5000);

      services.$timeout(function() {
        self.notifications.remove(key);
      }, (timeout || 5000) + 300);
    },
    throwError : function() {
      self.notifications.throwMessage.apply(this, ['error', null].concat(Array.prototype.slice.call(arguments)));
    },
    throwMessage : function(type, timeout, translation) {
      var origArguments = arguments;
      translation = services.$filter('translate')(translation || 'MESSAGE.GENERIC.0');
      Array.prototype.slice.call(arguments, 3).map(function(replacement) {
        translation = translation.replace('%%', replacement);
      });

      if (!services.$filter) {
        return setTimeout(function() {
          self.notifications.throwMessage.apply(this, Array.prototype.slice.call(origArguments));
        }, 200);
      }

      self.notifications.autoRemove(self.notifications.add(type, translation), timeout);
    }
  };

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
        directionX = config.directionX || 'center',
        directionY = config.directionY || (acr.fixed.bottom > (document.body.clientHeight - 200) ? 'up' : 'down');
      config.cssClass = 'ui-tooltip-' + directionY + ' ' + 'ui-tooltip-' + directionX + ' ' + (config.class || '');
      config.css = {
        minWidth : acr.width + 'px',
        top : directionY === 'down' ? (acr.bottom + 'px') : 'auto',
        bottom : directionY === 'up' ? ((document.body.clientHeight - acr.top) + 'px') : 'auto',
        left : directionX === 'center' ? (acr.left + (acr.width / 2)) + 'px' : (directionX === 'right' ? (acr.left + (acr.width / 2) - 25) + 'px' : 'auto'),
        right : directionX === 'left' ? (((document.body.clientWidth - acr.right) + (acr.width / 2)) - 9) + 'px' : 'auto'
      };

      if(apply && services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }
    }
  };

  // self.dropdown = {
  //   config : null,
  //   hide : function () {
  //     // self.dropdown.config = null;
  //     // if(services.$scope && !services.$scope.$$phase) {
  //     //   services.$scope.$apply();
  //     // }

  //   },
  //   show : function(config) {
  //     // if (!config || !config.targetEl || !config.targetEl.offsetParent) {
  //     //   return;
  //     // }
  //     // self.dropdown.config = config;

  //     // if(services.$scope && !services.$scope.$$phase) {
  //     //   services.$scope.$apply();
  //     // }

  //     // angular.element(document).off('click', this.hide).on('click', this.hide);
  //   },

  // };

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

  self.help = {
    visible : false,
    items : {},
    slots : [],
    getKeys : function() {
      return Object.keys(this.items);
    },
    getLabel : function(key) {
      return String.fromCharCode(64 + parseInt(key));
    },
    getCurrentIndex : function() {
      return this.getKeys().indexOf(this.current);
    },
    current : null,
    addItem : function(config) {
      if (!this.useSlot(config.slot)) {
        return false;
      }

      var existingKeys = this.getKeys();
      config.key = '' + (parseInt((existingKeys[existingKeys.length - 1]) || 0) + 1);
      config.template = 'help.html';
      config.data = config.translation;
      delete config.translation;
      config.class = 'ui-tooltip-wide ' + (config.class || '');
      return !!(this.items[config.key] = config);
    },
    removeItem : function(config) {
      this.freeSlot(config.slot);
      delete this.items[config.key];
      if (!this.items.length) {
        this.hide();
      }
    },
    useSlot : function(slotItem) {
      if (slotItem && this.slots.indexOf(slotItem) !== -1) {
        return false;
      }
      if (slotItem) {
        return !!this.slots.push(slotItem);
      }

      return true;
    },
    freeSlot : function(slotItem) {
      this.slots = this.slots.filter(function(item) {
        return item !== slotItem;
      });
    },
    show : function() {
      this.update();
      this.visible = true;
      this.go(this.getKeys()[0]);
      angular.element(window).off('resize', this.update).on('resize', this.update);
      (this.onShow || function() {})();
    },
    onShow : null,
    hide : function() {
      self.help.visible = false;
      self.help.current = null;
      self.tooltip.hide();
      angular.element(window).off('resize', self.help.update);
    },
    update : function(apply) {
      Object.keys(self.help.items).map(function(key) {
        if (!self.help.items[key].targetEl) {
          return delete self.help.items[key];
        }

        var item = self.help.items[key],
          acr = services.CommonBrowser.getAbsoluteClientRect(item.targetEl);
        item.posX = item.posX || 'leftCenter';
        item.posY = item.posY || 'topCenter';
        item.coords = [acr[item.posX], acr[item.posY]];
      });

      if(apply && services.$scope && !services.$scope.$$phase) {
        services.$scope.$apply();
      }
    },
    move : function(offset) {
      var newKey = this.getKeys()[this.getKeys().indexOf(this.current) + offset];
      if (!this.items[newKey]) {
        return;
      }
      this.go(newKey);
    },
    go : function(key) {
      if (!this.items[key]) {
        return;
      }

      this.current = key;
      self.tooltip.show(this.items[key]);
      services.CommonBrowser.ensureVisibility(this.items[key].targetEl);
    }
  };
};
