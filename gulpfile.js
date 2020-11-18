'use strict';
const { task, src, dest, watch, series, parallel } = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCSS = require("gulp-minify-css");
var pipeline = require('readable-stream').pipeline;
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var fileinclude = require('gulp-file-include');

function html() {
  return src('src/*.html')
    .pipe(fileinclude())
    .pipe(dest('build'))
    .pipe(browserSync.reload({stream: true}))
}

function fileinclude() {
  return src('src/include/**/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
}

function fonts() {
  return src('src/fonts/**/*.*')
    .pipe(dest('build/fonts'))
    .pipe(browserSync.reload({stream: true}))
}

function css() {
  return src('src/scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 2 versions'],
      cascade: false
    }))
    // .pipe(minifyCSS())
    .pipe(dest('build/css'))
    .pipe(dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
}

function js() {
  return src('src/js/**/*.js', { sourcemaps: false })
    //.pipe(uglify())
    .pipe(dest('build/js', { sourcemaps: false }))
    .pipe(browserSync.reload({stream: true}))
}

function img() {
  return src('src/images/**/*.*')
    .pipe(dest('build/images'))
    .pipe(browserSync.reload({stream: true}))
}

function watchFilesSCSS() {
    watch(
      ['./src/scss/*.scss', './src/scss/**/*.scss'],
      { events: 'all', ignoreInitial: false },
      series(css)
    );
}

function watchFilesHTML() {
  watch(
    ['./src/*.html', './src/**/*.html'],
    { events: 'all', ignoreInitial: false },
    series(html)
  );
}

function watchFilesJS() {
  watch(
    ['./src/js/**/*.js'],
    { events: 'all', ignoreInitial: false },
    series(js)
  );
}

function watchFilesImages() {
  watch(
    ['./src/images/**/*.*'],
    { events: 'all', ignoreInitial: false },
    series(img)
  );
}

function watchFilesFonts() {
  watch(
    ['./src/fonts/*.*'],
    { events: 'all', ignoreInitial: false },
    series(fonts)
  );
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  done();
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.fonts = fonts;
exports.build = parallel(html, css, js, img, fonts);
exports.default = parallel(serve, img, fonts, css, js, html, watchFilesImages, watchFilesFonts, watchFilesSCSS, watchFilesJS, watchFilesHTML);
