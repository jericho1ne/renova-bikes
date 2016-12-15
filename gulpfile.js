var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

var path = {
    src: 'src/',
    dest: 'app/',
    jquery: 'node_modules/jquery',
    bootstrap: 'node_modules/bootstrap',
};

var tempResourcePath = path.dest + '/resources';

// Banner
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css in the source dir
gulp.task('less', function() {
    return gulp.src('src/less/agency.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(tempResourcePath + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS - from source to dest
gulp.task('minify-css', ['less'], function() {
    return gulp.src(tempResourcePath + '/css/agency.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dest + '/css'))
        
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Clean temporary css resources directory
gulp.task('remove-css', function() {
	del([tempResourcePath + '/css'])
});


// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('src/js/agency.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dest + '/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src([path.bootstrap + '/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest(path.dest + '/vendor/bootstrap'))

    gulp.src([path.jquery + '/dist/jquery.js', path.jquery + '/dist/jquery.min.js'])
        .pipe(gulp.dest(path.dest + '/vendor/jquery'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest(path.dest + '/vendor/font-awesome'))

    gulp.src([
    		path.src + '/**/*.html', 
    		path.src + '/**/*.php',
    		path.src + '/**/*.js',
    	])
        .pipe(gulp.dest(path.dest))

    gulp.src([path.src + '/css/*.css']).pipe(gulp.dest(path.dest + '/css'))
    gulp.src([path.src + '/img/*']).pipe(gulp.dest(path.dest + '/img'))
})

// Run everything
gulp.task('default', [
	'less', 
	'minify-css', 
	'remove-css', 
	'minify-js', 
	'copy'
]);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

// Compiles SCSS files from /scss into /css
// NOTE: This theme uses LESS by default. To swtich to SCSS you will need to update this gulpfile by changing the 'less' tasks to run 'sass'!
gulp.task('sass', function() {
    return gulp.src('src/scss/agency.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
