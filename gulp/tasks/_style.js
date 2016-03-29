'use strict';

var gulp = require('gulp'),
  config = require('../config'),
  paths  = config.paths;

gulp.task('styles:clean', function(cb) {
  require('del').sync(paths.destination.styles);
  cb();
});

gulp.task('styles', gulp.series('styles:clean', function stylesBuild() {
  var sass     = require('gulp-sass'),
    cssnano    = require('gulp-cssnano'),
    prefix     = require('gulp-autoprefixer'),
    path       = require('path'),
    rev        = require('gulp-rev'),
    sourcemaps = require('gulp-sourcemaps');

  return gulp.src(paths.source.styles, {base : path.join(process.cwd(), paths.source.root)})
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: ['./' + paths.source.root  + ' css']}))
    .pipe(cssnano())
    .pipe(prefix('last 1 version', '> 1%'))
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dest))
    .pipe(rev.manifest({path: 'css.json'}))
    .pipe(gulp.dest(paths.source.rev));
}));
