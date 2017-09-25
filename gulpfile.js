const bower = require('gulp-bower');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');

gulp.task('watch', () => {
  gulp.watch('app/views/**', livereload());
  gulp.watch('public/js/**', livereload());
  gulp.watch('app/**/*.js', livereload());
  gulp.watch('public/views/**/*', livereload());
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**', livereload());
});


gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['app', 'config'],
    env: {
      PORT: 3000,
    }
  });
});

gulp.task('sass', () => {
  gulp.src('public/css/common/scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('lint', () => {
  gulp.src([
    'gulpfile.js',
    'public/js/**/*.js',
    'app/**/*.js',
    'test/**/*.js'
  ]).pipe(eslint());
});

gulp.task('mochaTest', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
    }));
});


gulp.task('angular', () => {
  gulp.src('bower_components/angular/**/*.js')
    .pipe(gulp.dest('public/lib/angular'));
});

gulp.task('angular-bootstrap', () => {
  gulp.src('bower_components/angular-bootstrap/**/*')
    .pipe(gulp.dest('public/lib/angular-bootstrap'));
});

gulp.task('angularUtils', () => {
  gulp.src('bower_components/angular-ui-utils/modules/route/route.js')
    .pipe(gulp.dest('public/lib/angular-ui-utils/modules'));
});

gulp.task('bootstrap', () => {
  gulp.src('bower_components/bootstrap/**/*')
    .pipe(gulp.dest('public/lib/bootstrap'));
});

gulp.task('jquery', () => {
  gulp.src('bower_components/juery/**/*')
    .pipe(gulp.dest('public/lib/jquery'));
});

gulp.task('underscore', () => {
  gulp.src('bower_components/underscore/**/*')
    .pipe(gulp.dest('public/lib/underscore'));
});

gulp.task('bower', () => {
  bower().pipe(gulp.dest('./bower_components'));
});

gulp.task('test', ['mochaTest']);
gulp.task('default', ['nodemon', 'watch', 'sass', 'angular', 'bootstrap', 'jquery', 'underscore', 'angularUtils', 'angular-bootstrap']);
