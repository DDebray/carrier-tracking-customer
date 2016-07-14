module.exports = [
  '$q',
function (
  $q
) {
  'use strict';

  var popups = angular.extend({}, {
    prepare : function(again) {
      if (!again) {
        this.deferred = $q.defer();
      }

      var _width = (screen.availWidth * 0.8),
        _height = (screen.availHeight * 0.8);

      this.popup = window.open('/wait.html', '', 'width=' + _width + ',height=' + _height + ',resizable=yes');
      if (this.popup) {
        this.popup.moveTo(screen.availWidth * 0.5, screen.availHeight * 0.5);
        this.popup.focus();
        this.deferred.resolve();
      } else {
        this.prepare(true);
      }

      return this.deferred.promise;
    },
    proceed : function(url) {
      this.deferred = $q.defer();

      if (!this.popup || !this.popup.location) {
        return $q.reject();
      }

      if (!url) {
        this.popup.close();
        return $q.reject();
      }

      this.popup.location.href = url;
      this.sendMessage = window.setInterval(function() {
        this.popup.postMessage('COUREON', '*');
      }.bind(this), 100);

      window.addEventListener('message', this.receiveMessage.bind(this), false);
      window.addEventListener('focus', this.finish.bind(this));

      return this.deferred.promise;
    },
    receiveMessage : function(e) {
      if (e.data.origin !== 'COUREON') {
        return;
      }

      if (e.data.data && e.data.data.messages && e.data.data.messages.length && e.data.data.messages[0].text) {
          this.deferred.reject(e.data.data.messages[0]);
      }

      if (e.data.data && e.data.data.status === 'OK') {
        this.deferred.resolve(e);
      }

      this.finish();
    },
    finish : function() {
      window.clearInterval(this.sendMessage);
      window.removeEventListener('message', this.receiveMessage);
      window.removeEventListener('focus', this.finish);

      if (this.popup) {
        this.popup.close();
      }

      if (this.deferred.promise.$$state.status !== 1) {
        this.deferred.reject();
      }
    }
  });

  return function () {
    return popups;
  };
}];
