var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*/scss') //Source all files ending with.scss in scss directory and its subdirectories
      .pipe(sass())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
          stream: true
      }))
});

gulp.task('useref', function() {
    return gulp.src('app/*.html') //Source all html files
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify())) //Minifies only if it is js file
      .pipe(gulpIf('*.css', cssnano())) //Minifies only if it is css file 
      .pipe(gulp.dest('dist'))
});

gulp.task('imagemin', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|swg)')
      .pipe(cache(imagemin({
          gif: {
              interlaced: true
          }
      })))
      .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean:dist', function() {
    return  del.sync('dist');
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  );
});

gulp.task('build', function(callback) {
    runSequence('clean:dist', ['sass', 'useref', 'imagemin', 'fonts'], callback);
});
