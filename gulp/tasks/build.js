'use strict';

/*******************************************************************************
 * BUILD TASK
 *
 * run all build related tasks with:
 *
 *  $ gulp build
 *
 */

var gulp = require('gulp');

function environment(cb) {
  var fs = require('fs'),
    paths = require('../config').paths;

  fs.writeFileSync(paths.source.scripts_env, 'module.exports = \'' + (process.env.ENV ? process.env.ENV : 'development') + '\';');
  cb();
}

// gulp.task('build', gulp.series(environment, 'version', gulp.parallel('sprite', 'scripts', 'images', 'copy'), 'styles', 'rev', 'template', 'size'));
gulp.task('build', gulp.series(environment, 'clean', gulp.parallel('copy', 'scripts', 'images', 'styles'), 'rev', 'templates', 'size'));
