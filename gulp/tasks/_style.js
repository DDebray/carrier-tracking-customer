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
    cleanCSS   = require('gulp-clean-css'),
    prefix     = require('gulp-autoprefixer'),
    path       = require('path'),
    rev        = require('gulp-rev'),
    sourcemaps = require('gulp-sourcemaps'),

    gutil      = require('gulp-util'),
    inline     = require('gulp-base64-inline'),
    through    = require('through2'),
    fs         = require('fs');

    var getInlinedImagesMetaData = through.obj(function(file, enc, callback) {
      var innerStr = file.inlinedImagesMetaData.map(function(data) {
        return '\'' + data.name + '\' : (\n\'width\' : ' + data.width + ',\n\'height\' : ' + data.height + '\n)';
      }).join(',\n');

      if (innerStr.length) {
        var outerStr = '$_inlineDimensionsData : (\n' + innerStr + '\n);';

        this.push(file);
        fs.writeFile(path.join(process.cwd(), paths.source.root + 'css/variables/_inline-dimensions.scss'), outerStr, function(err) {
          if (err) {
            throw err;
          }

          callback();
        });
      } else {
        callback();
      }
    });

  return gulp.src(paths.source.styles, {base : path.join(process.cwd(), paths.source.root)})
    .pipe(sourcemaps.init())

    .pipe(sass({includePaths: ['.' + path.delimiter + paths.source.root  + ' css']}))
    .on('error', gutil.log)
    .pipe(inline('../../public/images/'))
    .pipe(getInlinedImagesMetaData)

    .pipe(sass({includePaths: ['./' + paths.source.root  + ' css']}))
    .pipe(cleanCSS())
    .pipe(prefix('last 1 version', '> 1%'))
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dest))
    .pipe(rev.manifest({path: 'css.json'}))
    .pipe(gulp.dest(paths.source.rev));
}));
