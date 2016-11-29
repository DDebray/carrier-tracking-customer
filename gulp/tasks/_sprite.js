'use strict';

/*******************************************************************************
 * IMAGE TASK
 *
 * this task is responsible for image optimization
 *  - optimize all images in the assets folder and move them to
 *    the public folder
 */

var gulp = require( 'gulp' );

gulp.task( 'sprite', function () {
  var imagemin = require( 'gulp-imagemin' ),
    spritesmith = require( 'gulp.spritesmith' ),
    buffer = require( 'vinyl-buffer' ),
    path = require( 'path' ),
    paths = require( '../config' ).paths,
    spriteData = gulp.src( paths.source.sprite )
    .pipe( spritesmith( {
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      algorithm: 'binary-tree',
      imgPath: '../../images/sprite.png?b=' + ( new Date().getTime() ),
      padding: 2,
      cssVarMap: function ( sprite ) {
        var parts = sprite.source_image.split( path.sep );
        var group = parts[ parts.length - 2 ] === 'sprite' ? '' : parts[ parts.length - 2 ] + '-';
        sprite.name = ( 'sprite-' + group + sprite.name ).toLowerCase();
      }
    } ) );

  spriteData.img
    .pipe( buffer() )
    .pipe( imagemin() )
    .pipe( gulp.dest( paths.destination.sprite.img ) );

  spriteData.css
    .pipe( gulp.dest( paths.destination.sprite.scss ) );

  return spriteData;
} );
