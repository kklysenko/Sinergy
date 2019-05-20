const gulp 		     = require('gulp');
const sass 		     = require('gulp-sass');
const concat 	     = require('gulp-concat');
const debug 	     = require('gulp-debug');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS 	   = require('gulp-clean-css');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const del 		     = require('del');
const browserSync  = require('browser-sync').create();
const csso 		     = require('gulp-csso');
// const htmlmin      = require('gulp-htmlmin');
const pug         = require('gulp-pug');



const cssFiles = [
	'./src/css/*.css',
	]

const jsFiles = [
	'./src/js/*.js',
	]
const images = [
	'./src/images/*',
	]
const icons = [
	'./src/images/icons/*',
	]
const pugFiles = [
	'./src/index.pug',
]

function styles() {
	return gulp.src(cssFiles)
				.pipe(concat('all.min.css'))
				.pipe(debug({title: 'unicorn:'}))
				.pipe(autoprefixer({
					browsers: ['>0.1%'],
					cascade: true
				}))
				.pipe(csso())
				.pipe(cleanCSS({
					level: 2
				}))
				.pipe(gulp.dest('dist/css'))
				.pipe(browserSync.stream());
}
function sasscss(){
	return gulp.src('src/sass/style.sass')
				.pipe(sass().on('error', sass.logError))
    			.pipe(gulp.dest('src/css'))
    			.pipe(browserSync.stream());
}

function scripts(){
	return gulp.src(jsFiles)
				.pipe(concat('all.min.js'))
				.pipe(gulp.dest('dist/js'))
				.pipe(browserSync.stream());
};

function pugSync() {
	return gulp.src(pugFiles)
				 .pipe(pug())
				 .pipe(gulp.dest('src/'))
				 .pipe(browserSync.stream());
};

function pugCompiler() {
 	return gulp.src('src/index.pug')
    			.pipe(pug())
    			.pipe(gulp.dest('dist/'))
};


function debuger(){
	return gulp.src('./src/*')
		.pipe(debug({title: 'unicorn:'}))
		.pipe(gulp.dest('dist/'))
};

function watch (){
	browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
	gulp.watch('src/**/*.sass').on('change', sasscss, browserSync.reload);
	gulp.watch('src/js/*.js').on('change', scripts);
	gulp.watch(['src/*.pug','src/jade/**/*.pug' ]).on('change', pugSync, browserSync.reload);
	gulp.watch('src/*.html').on('change', browserSync.reload);
	
}

function clean(){
	return del(['dist/*'])
}

function imageMinify(){
	return gulp.src(images)
			.pipe(imagemin())
			.pipe(gulp.dest('dist/images'))
}
function iconsMinify(){
	return gulp.src(icons)
			.pipe(imagemin())
			.pipe(gulp.dest('dist/images/icons'))
}

// function htmlMinify(argument) {
// 	return gulp.src('src/*.html')
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(gulp.dest('dist'));
// }

gulp.task('styles', styles);
gulp.task('scripts', scripts); 
gulp.task('watch', watch);
gulp.task('sass', sasscss);
gulp.task('debuger', debuger);
gulp.task('imageMinify', imageMinify);
gulp.task('iconsMinify', iconsMinify);
gulp.task('pugCompiler', pugCompiler);
gulp.task('pugSync', pugSync);
// gulp.task('htmlMinify', htmlMinify);
gulp.task('clean', clean);

gulp.task('build', gulp.series(clean, //clean - без кавычек, т.к. не таск, а функция. series - вызывает таски поочередно
			gulp.series(sasscss,
			gulp.parallel(styles, scripts, imageMinify, iconsMinify, pugCompiler  /*htmlMinify*/) //parallel - выполняет таски параллельно
			)));
gulp.task('dev', gulp.series('build', 'watch'));