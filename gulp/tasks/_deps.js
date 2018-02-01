'use strict';

/*******************************************************************************
 * dependency TASK
 *
 * checks dependecies on timeliness
 */

var gulp = require('gulp'),
  npmCheck = require('gulp-npm-check');

gulp.task('deps', function(cb) {
  npmCheck({ throw: false }, cb);
});
