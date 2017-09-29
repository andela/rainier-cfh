const bower = require('gulp-bower');
const newer = require('gulp-newer');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');


gulp.task('watch', () => {
  gulp.watch('app/views/**/*', ['jade']);
  gulp.watch('public/js/**', ['public:js']);
  gulp.watch('app/**/*.js', ['transpile-app']);
  gulp.watch('public/views/**/*', ['html']);
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**/*', ['css']);
});


gulp.task('lint', () => (
  gulp.src([
    'gulpfile.js',
    'public/js/**/*.js',
    'app/**/*.js',
    'test/**/*.js'
  ])
    .pipe(eslint())
));

gulp.task('transpile-app', ['lint'], () => (
  gulp.src('app/**/*.js')
    .pipe(newer('dist/app'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/app'))
));

gulp.task('server', ['lint'], () => (
  gulp.src('server.js')
    .pipe(newer('dist'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: ['transform-runtime']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
));

gulp.task('jade', ['lint'], () => (
  gulp.src('app/**/*.jade')
    .pipe(newer('dist/app'))
    .pipe(gulp.dest('dist/app'))
));

gulp.task('css', ['lint'], () => (
  gulp.src('public/**/*.css')
    .pipe(newer('dist/public'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/public'))
));

gulp.task('images', ['lint'], () => (
  gulp.src('public/img/**/*')
    .pipe(newer('dist/public/img'))
    .pipe(imagemin({ optimizationLevel: 9 }))
    .pipe(gulp.dest('dist/public/img'))
));

gulp.task('html', ['lint', 'images'], () => (
  gulp.src('public/views/**/*.html')
    .pipe(newer('dist/public/views/**/*.html'))
    .pipe(htmlclean())
    .pipe(gulp.dest('dist/public/views'))
));

gulp.task('public:js', ['lint'], () => (
  gulp.src('public/js/**/*.js')
    .pipe(newer('dist/public/js'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/public/js'))
));

gulp.task('config:js', ['lint'], () => (
  gulp.src('config/**/*.js')
    .pipe(newer('dist/config'))
    .pipe(babel())
    .pipe(gulp.dest('dist/config'))
));

gulp.task('config:json', ['lint'], () => (
  gulp.src('config/**/*.json')
    .pipe(newer('dist/config'))
    .pipe(gulp.dest('dist/config'))
));

gulp.task('nodemon', ['watch', 'build'], () => (
  nodemon({
    script: 'dist/server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['app', 'config', 'public'],
    task: ['watch', 'build'],
    env: {
      PORT: 3000,
    }
  })
));

gulp.task('sass', () => (
  gulp.src('public/css/common/scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'))
));


gulp.task('mochaTest', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
    }));
});


gulp.task('angular', () => (
  gulp.src('bower_components/angular/**/*.js')
    .pipe(gulp.dest('public/lib/angular'))
));

gulp.task('angular-bootstrap', () => (
  gulp.src('bower_components/angular-bootstrap/**/*')
    .pipe(gulp.dest('public/lib/angular-bootstrap'))
));

gulp.task('angularUtils', () => (
  gulp.src('bower_components/angular-ui-utils/modules/route/route.js')
    .pipe(gulp.dest('public/lib/angular-ui-utils/modules'))
));

gulp.task('bootstrap', () => (
  gulp.src('bower_components/bootstrap/**/*')
    .pipe(gulp.dest('public/lib/bootstrap'))
));

gulp.task('jquery', () => (
  gulp.src('bower_components/jquery/**/*')
    .pipe(gulp.dest('public/lib/jquery'))
));

gulp.task('underscore', () => (
  gulp.src('bower_components/underscore/**/*')
    .pipe(gulp.dest('public/lib/underscore'))
));

gulp.task('bower', () => (
  bower().pipe(gulp.dest('./bower_components'))
));

gulp.task('move:lib', () => {
  gulp.src('public/lib/**/*')
    .pipe(gulp.dest('dist/public/lib'));
});

gulp.task('test', ['mochaTest']);

gulp.task('default', [
  'watch',
  'nodemon',
  'sass',
  'angular',
  'bootstrap',
  'jquery',
  'underscore',
  'angularUtils',
  'angular-bootstrap'
]);

gulp.task('build', [
  'transpile-app',
  'server',
  'jade',
  'config:js',
  'config:json',
  'public:js',
  'css',
  'images',
  'html',
  'angular',
  'bootstrap',
  'jquery',
  'underscore',
  'angularUtils',
  'angular-bootstrap',
  'move:lib'
]);
