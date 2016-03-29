module.exports = ['CommonUi', '$timeout', function(CommonUi, $timeout) {
  'use strict';
  var self = this;

  CommonUi.$timeout = $timeout;

  self.locked = function() {
    return CommonUi.locked;
  };

  self.busy = function() {
    return CommonUi.busy;
  };

  self.hidden = function() {
    return CommonUi.hidden;
  };

  self.notifications = function() {
    return CommonUi.notifications;
  };

  self.tooltip = function() {
    return CommonUi.tooltip.config;
  };

  self.hideTooltip = CommonUi.tooltip.hide;

  self.modal = function() {
    return CommonUi.modal;
  };

  self.tasks = function() {
    return CommonUi.tasks;
  };

  self.help = function() {
    return CommonUi.help;
  };
}];
