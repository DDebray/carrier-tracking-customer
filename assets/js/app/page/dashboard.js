module.exports = ['$scope', 'CommonRequest', function($scope, CommonRequest) {
  'use strict';
  var self = this;

  self.news = null;
  self.newsExpanded = false;
  self.status = null;
  self.accountBalance = null;

  CommonRequest.cms.news.get({}, function(response) {
    self.news = response.content;
  });

  CommonRequest.dashboard.get({}, function(response) {
    if (response && response.content) {
      self.status = response.content.dashboard || {};
    }
  });
}];
