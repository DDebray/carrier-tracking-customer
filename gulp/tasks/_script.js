'use strict';

var gulp = require('gulp'),
  paths = require('../config').paths;

gulp.task('scripts:clean', function(cb) {
  require('del').sync(paths.destination.scripts);
  cb();
});

gulp.task('scripts:rev', function() {
  var rev = require('gulp-rev');

  return gulp.src(paths.destination.scripts + '**/*.js', {base : paths.destination.root})
  .pipe(rev())
  .pipe(gulp.dest(paths.destination.root))
  .pipe(rev.manifest({path: 'js.json'}))
  .pipe(gulp.dest(paths.source.rev));
});

gulp.task('scripts', gulp.series('scripts:clean', function scriptsBuild() {
  var jshint = require('gulp-jshint');

  gulp.src(paths.source.jshint)
    .pipe(jshint({ esnext : true }))
    .pipe(jshint.reporter('jshint-stylish'));
    // .pipe(jshint.reporter('fail'));

  var
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    path       = require('path'),
    gutil      = require('gutil');

  return browserify({ entries : paths.source.scripts })
    .bundle()
    .on('error', gutil.log)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dest + 'js'));
}, 'scripts:rev'));
