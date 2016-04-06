'use strict';

var gulp = require('gulp'),
  modRewrite  = require('connect-modrewrite');

gulp.task('server:reload', function(cb) {
  require('browser-sync').reload();
  return cb();
});

gulp.task('server', function(cb) {
  require('browser-sync')({
    server : {
      baseDir : require('../config').paths.dest,
      // see http://jjt.io/2013/11/16/angular-html5mode-using-yeoman-generator-angular/
      middleware: [
          modRewrite([
              '^[^\\.]*$ /index.html [L]'
          ])
      ]
    },
    notify : false,
    open : false,
    reloadOnRestart : true
  });

  return cb();
});
