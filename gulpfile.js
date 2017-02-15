var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

//script paths
var jsFiles = ['src/**/*.js', '!test/**/*.spec.js'];
var jsDest = 'dist/js';

// Clean the distribution directories
gulp.task('clean', function(){
    del.sync(['../resources/static/', 'dist/'], { force: true});
});

// Minify and copy js files to dist folder
gulp.task('scripts', function() {
    gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(ngAnnotate({add:true}))
        .pipe(rename('ks-datepicker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('build', ['clean', 'scripts']);