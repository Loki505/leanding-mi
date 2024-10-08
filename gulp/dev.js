const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');
// const media = require('gulp-group-css-media-queries');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs =  require('fs');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassGlob = require('gulp-sass-glob');
const replace = require('gulp-replace');

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
gulp.task('html:dev', function (){
    return gulp.src(['./src/html/**/*.html', '!./src/html/block/*.html'])
        .pipe(changed('./build/',{hasChanged: changed.compareContents}))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(gulp.dest('./build/'));
})

// Компиляция SASS
// ИСХОДНЫЕ СТИЛИ CSS
// GROUP MEDIA
gulp.task('sass:dev', function (){
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify('CSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        // .pipe(media())
        // .pipe(
        //     replace(
        //         /(['"]?)(\.\.\/)+(img|images|fonts|css|sass|scss|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/g,
        //         '$1$2$3$4$6$1'
        //     )
        // )
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
})


// Копирование изображений
gulp.task('images:dev', function (){
    return gulp.src('./src/img/**/*', { encoding: false })
        .pipe(changed('./build/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./build/img/'))
})
gulp.task('fonts:dev', function (){
    return gulp.src('./src/fonts/**/*', { encoding: false })
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
})


gulp.task('js:dev', function (){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./build/js'))
})

// Запуск LIVESERVER
const serverOption = {
    livereload: true,
    open: true
};
gulp.task('server:dev', function (){
    return gulp.src('./build/').pipe(server(serverOption))
})

// CLEAN
gulp.task('clean:dev', function (done){
    if(fs.existsSync('./build/')){
        return gulp.src('./build/', {read: false}).pipe(clean());
    }
    done();
})

// TASK WATCH
gulp.task('watch:dev', function (){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
})





