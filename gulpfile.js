var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var colors = require( "colors");
gulp.task('packagejs',function  () {
    var b = browserify();   
    b.add('./src/evoflux.js', { debug: false });
    return b.bundle()
      .on('error',function(err){
        console.error(err.message.red);
        console.error(err.stack.yellow);
        this.emit('end');
      })
      .pipe(source('evoflux.js'))
      .pipe(gulp.dest('./dist/'));
      //.pipe(gulp.rename);

});

gulp.task('default',['packagejs']);