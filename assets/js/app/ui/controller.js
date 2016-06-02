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

  self.tooltip = function() {
    return CommonUi.tooltip.config;
  };

  self.hideTooltip = CommonUi.tooltip.hide;

  self.modal = function() {
    return CommonUi.modal;
  };
}];
