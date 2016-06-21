module.exports = function(application) {
  'use strict';

  application
    // directives without dependencies
    .directive('banner',          require('./directives/banner'))
    .directive('carrierLogo',     require('./directives/carrierLogo'))
    .directive('hero',            require('./directives/hero'))
    .directive('list',            require('./directives/list'))
    .directive('preventDefault',  require('./directives/preventDefault'))
    .directive('stopPropagation', require('./directives/stopPropagation'))
    .directive('tab',             require('./directives/tab'))
    .directive('tabPanel',        require('./directives/tabPanel'))

    // directives with dependencies
    .directive('address',         ['StorageCountries', require('./directives/address')])
    .directive('addressForm',     ['StorageCountries', require('./directives/addressForm')])
    .directive('autofocus',       ['$timeout', require('./directives/autofocus')])
    .directive('selectOnClick',   ['$window', require('./directives/selectOnClick')])
    .directive('tooltip',         ['CommonUi', require('./directives/tooltip')])
    .directive('watchHeight',     ['$timeout', require('./directives/watchHeight')])
    .directive('centerVertical',  ['$parse', '$timeout', '$window', require('./directives/centerVertical')])
    ;
};
