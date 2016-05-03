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

  self.modal = function() {
    return CommonUi.modal;
  };
}];
