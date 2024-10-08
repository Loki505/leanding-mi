const svgSprite = require('gulp-svg-sprite');
const gulp = require("gulp");
const config = {
    dest: '.',
    log: null,
    shape: {
        id: {
            separator: '--',
            pseudo: '~'
        },
    },
    mode: {
        css: {
            render: {
                css: true
            }
        },
        symbol: {
            inline: true
        }
    }
};
gulp.task('sprite', function (){
    return gulp.src('./src/svg/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./build/sprite/'))
})
