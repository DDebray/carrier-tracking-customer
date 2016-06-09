module.exports = function(application) {
  'use strict';


  application
    // directives without dependencies
    .directive('carrierLogo',     require('./directives/carrierLogo'))
    .directive('preventDefault',  require('./directives/preventDefault'))
    .directive('stopPropagation', require('./directives/stopPropagation'))
    .directive('banner', require('./directives/banner'))
    .directive('hero', require('./directives/hero'))
    .directive('list', require('./directives/list'))
    .directive('tab', require('./directives/tab'))
    .directive('tabPanel', require('./directives/tabPanel'))

    // directives with dependencies
    .directive('watchHeight',   ['$timeout', require('./directives/watchHeight')])
    .directive('address',       [/*'StorageCountries',*/ require('./directives/address')])
    .directive('addressForm',   [/*'StorageCountries',*/ require('./directives/addressForm')])
    .directive('autofocus',     ['$timeout', require('./directives/autofocus')])
    .directive('selectOnClick', ['$window', require('./directives/selectOnClick')])
    .directive('tooltip',       ['CommonUi', require('./directives/tooltip')])
    ;
};
