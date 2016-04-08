'use strict';

/*******************************************************************************
 * TEMPLATE TASK
 *
 * this task is responsible for the HTML template for standalone-server
 *  - populate the placeholders for the optimized script & style file names
 *  - and minify the HTML template file to save some bits
 */

var gulp = require('gulp'),
  config    = require('../config'),
  fs = require('fs');

gulp.task('templates:readFooter', function(cb) {
  var $ = require('jquery'),
    env = require('jsdom').env,
    paths = require('../config').paths;

  env(config.paths.source.footer_url, function (errors, window) {
    var $ = require('jquery')(window);

    // var $footer = $('.footer').html();
    var $footer = $('.footer').wrap('<footer></footer>').parent();
    // console.log('$footer', $footer.find('.footer__link'));

    $footer.find('a.footer__link').each(function() {
      // console.log('this', this);
      this.href = this.href;
    });



    fs.writeFileSync(config.paths.source.footer, $footer.html());
    cb();
  });
});

gulp.task('templates', gulp.series('templates:readFooter', function() {
  var template    = require('gulp-template'),
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
      }))
    .pipe(minifyHTML({
      comments : false,
      spare : false
    }))
    .pipe(gulp.dest(config.paths.dest))
    .pipe(connect.reload({
      stream : true
    }));
}));
