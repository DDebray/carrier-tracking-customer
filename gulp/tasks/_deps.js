'use strict';

/*******************************************************************************
 * dependency TASK
 *
 * checks dependecies on timeliness
 */

var gulp = require('gulp'),
  checkDeps = require('gulp-check-deps');

gulp.task('deps', function() {
    return gulp.src('package.json')
      .pipe(checkDeps());
});
