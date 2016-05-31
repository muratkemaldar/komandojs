var gulp = require('gulp');
var babel = require("gulp-babel");
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

//default
gulp.task('default', ['goKomando'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./komando-src.js", ['goKomando']);
    gulp.watch("./komando-src.js").on('change', browserSync.reload);
});

//scripts
gulp.task('goKomando', function() {
  return gulp.src([
      './komando-src.js'
    ])
    .pipe(babel())
    .pipe(concat("komando-dev.js"))
    .pipe(gulp.dest("./"));
});