module.exports = [function() {
  'use strict';

  var browser = {
    getAbsoluteClientRect : function(element) {
      var clientRect = element.getBoundingClientRect(),
        bodyClientRect = document.body.getBoundingClientRect();

      return {
        width : clientRect.width,
        height : clientRect.height,
        left : clientRect.left - bodyClientRect.left,
        top : clientRect.top - bodyClientRect.top,
        right : clientRect.right - bodyClientRect.left,
        bottom : clientRect.bottom - bodyClientRect.top,
        fixed : clientRect,
        leftCenter : (clientRect.left - bodyClientRect.left) + (clientRect.width / 2),
        topCenter : (clientRect.top - bodyClientRect.top) + (clientRect.height / 2)
      };
    },/*
    smoothScroll : function(element, target, duration) {
      target = Math.round(target);
      duration = Math.round(duration);
      if (duration < 0) {
        return;
      }
      if (duration === 0) {
        element.scrollTop = target;
        return;
      }

      var start_time = Date.now(),
        end_time = start_time + duration,
        start_top = element.scrollTop,
        distance = target - start_top;

      var smoothStep = function(start, end, point) {
        if (point <= start) { return 0; }
        if (point >= end) { return 1; }
        var x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
      };
      var previous_top = element.scrollTop;
      var scrollFrame = function() {
        if (element.scrollTop !== previous_top) {
          return;
        }

        var now = Date.now();
        var point = smoothStep(start_time, end_time, now);
        var frameTop = Math.round(start_top + (distance * point));
        element.scrollTop = frameTop;

        if (now >= end_time || (element.scrollTop === previous_top && element.scrollTop !== frameTop)) {
          return;
        }

        previous_top = element.scrollTop;
        setTimeout(scrollFrame, 0);
      };

      setTimeout(scrollFrame, 0);
    },*/
    ensureVisibility : function(targetEl, toElementTop) {
      if (!targetEl) {
        return;
      }

      var windowHeight = document.body.clientHeight,
        acr = this.getAbsoluteClientRect(targetEl);

      if (acr.fixed.top > 0 && (toElementTop ? (acr.fixed.top + 100) : acr.fixed.bottom) < windowHeight) {
        return;
      }

      document.documentElement.scrollTop = Math.round((acr.top + (toElementTop ? 0 : (acr.height / 2))) - (toElementTop ? 0 : (windowHeight / 2)));
      document.body.scrollTop = Math.round((acr.top + (acr.height / 2)) - (windowHeight / 2));
    }
  };

  return browser;
}];