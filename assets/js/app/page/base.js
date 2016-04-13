module.exports = ['CommonUi', function(CommonUi) {
  'use strict';
  var self = this;

  self.viewLocked = function() {
    return !!CommonUi.modal.template;
  };

}];
