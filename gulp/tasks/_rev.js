'use strict';

/*******************************************************************************
 * REV TASK
 *
 * concats the rev files
 */

var gulp = require('gulp');

gulp.task('rev', function() {
  var jsoncombine = require('gulp-jsoncombine'),
    config   = require('../config'),
    paths    = config.paths;

  return gulp.src([paths.source.rev + '*.json', '!' + paths.source.rev + 'all.json'])
    .pipe(jsoncombine( 'all.json', function(data) {
      data = Object.keys(data).map(key => data[key]).reduce((result, item) => Object.assign(result, item), {});
      return new Buffer(JSON.stringify(data, null, 2));
    } ))
    .pipe(gulp.dest(paths.source.rev));
});
