const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');
const media = require('gulp-group-css-media-queries');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs =  require('fs');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassGlob = require('gulp-sass-glob');
const autoprefix = require('gulp-autoprefixer');
const csso = require('gulp-csso');
// const htmlclean = require('gulp-htmlclean');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpCSS = require('gulp-webp-css');

// NOTIFY
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}


// HTML Сборка
const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file'
}
gulp.task('html:docs', function (){
    return gulp.src(['./src/html/**/*.html', '!./src/html/block/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(webpHTML())
        // .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'));
})

// Компиляция SASS
// ИСХОДНЫЕ СТИЛИ CSS
// GROUP MEDIA
gulp.task('sass:docs', function (){
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('CSS')))
        .pipe(sourceMaps.init())
        .pipe(autoprefix())
        .pipe(sassGlob())
        .pipe(webpCSS())
        .pipe(sass())
        .pipe(media())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'))
})


// Копирование изображений
gulp.task('images:docs', function (){
    return gulp.src('./src/img/**/*', { encoding: false })
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))

        .pipe(gulp.src('./src/img/**/*', { encoding: false }))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./docs/img/'))
})
gulp.task('fonts:docs', function (){
    return gulp.src('./src/fonts/**/*', { encoding: false })
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
})

gulp.task('js:docs', function (){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./docs/js'))
})

// Запуск LIVESERVER
const serverOption = {
    livereload: true,
    open: true
};
gulp.task('server:docs', function (){
    return gulp.src('./docs/').pipe(server(serverOption))
})

// CLEAN
gulp.task('clean:docs', function (done){
    if(fs.existsSync('./docs/')){
        return gulp.src('./docs/', {read: false}).pipe(clean());
    }
    done();
})







