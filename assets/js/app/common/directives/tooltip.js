module.exports = function ( CommonUi ) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      getValues: '&tooltip'
    },
    link: function ( scope, elements ) {
      var config = {},
        updateConfig = function () {
          config = scope.getValues();
          ( config || {} ).targetEl = elements[ 0 ];
        };
      updateConfig();

      if ( !config ) {
        return;
      }

      switch ( config.on ) {
      case 'enter':
        elements.on( 'mouseenter', function () {
          updateConfig();
          CommonUi.tooltip.show( config );
        } );

        elements.on( 'mouseleave', function () {
          CommonUi.tooltip.hide();
        } );
        break;
      case 'click':
        elements.on( 'click', function () {
          if ( !CommonUi.tooltip.config || CommonUi.tooltip.config.targetEl !== config.targetEl ) {
            updateConfig();
            CommonUi.tooltip.show( config );
          } else {
            CommonUi.tooltip.hide();
          }
        } );
        break;
      }

      if ( typeof config.onTrue !== 'undefined' ) {
        scope.$watch( 'getValues().onTrue', function ( newVal ) {
          if ( newVal ) {
            updateConfig();
            CommonUi.tooltip.show( config );
          } else {
            CommonUi.tooltip.hide();
          }
        } );
      }

      scope.$on( '$destroy', function () {
        if ( CommonUi.tooltip.config && CommonUi.tooltip.config.targetEl === config.targetEl ) {
          CommonUi.tooltip.hide();
        }
      } );
    }
  };
};
