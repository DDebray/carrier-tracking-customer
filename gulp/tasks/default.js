'use strict';

/**
 * DEFAULT TASK
 *
 * Default gulp task will run all building tasks.
 *
 *  $ gulp
 *
 */

var gulp = require('gulp');
gulp.task('default', gulp.series('build'));