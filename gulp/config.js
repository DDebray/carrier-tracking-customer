var ASSETS_DIR = 'assets/';
var PUBLIC_DIR = 'public/';

var config = {
  paths: {
    source: {
      templates: ASSETS_DIR + 'templates/**/*.html',
      footer: ASSETS_DIR + 'templates/views/partials/coureon_footer.html',
      footer_url: 'http://www.coureon.com',
      jshint: ASSETS_DIR + 'js/**/*.js',
      styles: ASSETS_DIR + 'css/**/*.{sass,scss}',
      scripts: ASSETS_DIR + 'js/main.js',
      scripts_vendor: ASSETS_DIR + 'js/vendor/**/*.js',
      scripts_env: ASSETS_DIR + 'js/app/environment.js',
      // images          : ASSETS_DIR + 'images/**/*.{png,jpg,jpeg,gif,svg}',
      images: [ ASSETS_DIR + 'images/**/*', '!' + ASSETS_DIR + 'images/sprite/**/*' ],
      sprite: ASSETS_DIR + 'images/sprite/**/*.{png,jpg,jpeg}',
      copy: ASSETS_DIR + 'copy/**/*',
      rev: ASSETS_DIR + 'rev/',
      root: ASSETS_DIR
    },
    dest: PUBLIC_DIR,
    destination: {
      templates: PUBLIC_DIR,
      styles: PUBLIC_DIR + 'css/',
      scripts: PUBLIC_DIR + 'js/',
      images: PUBLIC_DIR + 'images/',
      sprite: {
        img: PUBLIC_DIR + 'images/',
        scss: ASSETS_DIR + 'css/variables/'
      },
      root: PUBLIC_DIR
    }
    //hosts: {
    //   static : {
    //     development : 'http://localhost:3000/',
    //     testing : 'https://www-tracking.coureon.com',
    //     production : 'https://tracking.coureon.com'
    //   }
    // }
  }
};

module.exports = config;
