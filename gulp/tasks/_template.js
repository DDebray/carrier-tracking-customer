'use strict';

/*******************************************************************************
 * TEMPLATE TASK
 *
 * this task is responsible for the HTML template for standalone-server
 *  - populate the placeholders for the optimized script & style file names
 *  - and minify the HTML template file to save some bits
 */

var gulp = require('gulp');

gulp.task('templates', function() {
  var config    = require('../config'),
    fs          = require('fs'),
    template    = require('gulp-template'),
    minifyHTML  = require('gulp-minify-html'),
    connect     = require('gulp-connect'),
    path        = require('path');

  delete require.cache[path.resolve(config.paths.source.rev + 'all.json')];
  var revs = require('..' + path.sep + '..' + path.sep + config.paths.source.rev + 'all.json');

  return gulp.src(config.paths.source.templates)
    .pipe(template({
        asset : function(name) {
          return '/' + revs[name];
        },
        basepath : '/'
        // cmspath : config.paths.hosts.static[process.env.ENV ? process.env.ENV : 'development'],
        // inlineSvg : function(name) {
        //   return fs.readFileSync(config.paths.dest.images + name, {
        //     encoding : 'utf8'
        //   });
        // }
      }))
    .pipe(minifyHTML({
      comments : false,
      spare : false
    }))
    .pipe(gulp.dest(config.paths.dest))
    .pipe(connect.reload({
      stream : true
    }));
});
