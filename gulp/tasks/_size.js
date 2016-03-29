'use strict';

/*******************************************************************************
 * SIZE TASK
 *
 * this task will show you file sizes after build process
 */

var gulp = require('gulp');

gulp.task('size' , function() {
  var gutil = require('gulp-util'),
    paths   = require('../config').paths,
    size    = require('gulp-size');

  gutil.log('***********************************');
  gutil.log('--> current total size (w/o view partials & font file type variants) gzipped: ');

  return gulp.src([paths.destination.root + '**/*', '!' + paths.destination.templates + 'views/**/*', '!' + paths.destination.root + '**/*.map', '!' + paths.destination.root + '**/*.{eot,woff,woff2,ttf}', '!' + paths.destination.images + 'content/**/*'])
    .pipe(size({
      showFiles : true,
      gzip      : true
    }))
    .pipe(gulp.dest(paths.destination.root));
});
