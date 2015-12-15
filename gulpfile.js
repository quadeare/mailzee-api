var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks
// -----------------

gulp.task('browser-sync', ['nodemon'], function () {

  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['google-chrome']
  });
});

gulp.task('nodemon', function (cb) {
	var called = false;
	return nodemon({script: 'app.js'}).on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	});
});

// Watchers
gulp.task('watch', ['browser-sync'], function() {
  watch('public/scss/*.scss', ['sass']);
  watch('views/*.jade', browserSync.reload);
  watch('views/**/*.jade', browserSync.reload);
});

// Cleaning
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})


// Build Sequences
// ---------------

gulp.task('default', ['watch', 'browser-sync'], function () {
});

gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['sass'],
    callback
  )
})
