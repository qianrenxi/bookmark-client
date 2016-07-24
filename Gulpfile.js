var gulp = require('gulp');
var gulpLoadPugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
const del = require('del');

const $p = gulpLoadPugins();
const reload = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src('src/assets/styles/*.scss')
        .pipe($p.sass.sync().on('error', $p.sass.logError))
        .pipe(gulp.dest('.tmp/assets/styles'))
        .pipe(gulp.dest('dist/assets/styles'));
});

gulp.task('templates', function () {
    return gulp.src('src/templates/**/*.html')
        .pipe($p.ngHtml2js({
            moduleName: function (file) {
                var pathParts = file.path.split('/');
                var folder = pathParts[pathParts.length - 2];
                /*if (folder === "view-framework") {
                    return "qui.viewFramework";
                } else {*/
                    /*return "tmr.bookmark." + folder.replace(/-[a-z]/g, function (match) {
                            return match.substr(1).toUpperCase();
                        });*/
                //}
                return "tmr.bookmark";
            },
            prefix: "tmr/templates/bookmark/"
        }))
        .pipe(gulp.dest(".tmp/templates"));
});

gulp.task('scripts', ['templates'], function () {
    return gulp.src(['src/scripts/**/*.js', '.tmp/templates/**/*.js'])
        .pipe($p.concat('bookmark.js'))
        .pipe(gulp.dest(".tmp/scripts/"))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('serve', ['styles', 'scripts'], function () {
    browserSync({
        notify: false,
        port: 9001,
        server: {
            baseDir: ['.tmp', 'src'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch([
        'src/**/*'
    ]).on('change', reload);

    gulp.watch('src/assets/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/templates/**/*.html', ['scripts']);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('dist', ['styles', 'scripts'], function () {
});

gulp.task('default', ['clean'], function () {
    gulp.start('dist');
});