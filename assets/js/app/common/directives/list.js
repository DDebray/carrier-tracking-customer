module.exports = function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      list: '=model',
    },
    replace: true,
    transclude: true,
    templateUrl: '/views/partials/list.html'
  };
};
