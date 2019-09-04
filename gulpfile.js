var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var sass = require('gulp-sass');
var bSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
// var php = require('gulp-connect-php');

var pkg = require('./package.json');


var path = {
	src: 'src/',
	dest: 'app/',
	jquery: 'node_modules/jquery',
	bootstrap: 'node_modules/bootstrap',
};

var tempResourcePath = path.dest + 'resources';

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
		.pipe(bSync.reload({
			stream: true
		}))
});

// Minify compiled CSS - from source to dest
gulp.task('minify-css', ['less'], function() {
	return gulp.src(tempResourcePath + '/css/agency.css')
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.dest + 'css'))
		.pipe(bSync.reload({
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
		.pipe(gulp.dest(path.dest + 'js'))
		.pipe(bSync.reload({
			stream: true
		}))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
	gulp.src([path.bootstrap + '/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
		.pipe(gulp.dest(path.dest + 'vendor/bootstrap'))

	gulp.src([path.jquery + '/dist/jquery.js', path.jquery + '/dist/jquery.min.js'])
		.pipe(gulp.dest(path.dest + 'vendor/jquery'))

	gulp.src([
			'node_modules/font-awesome/**',
			'!node_modules/font-awesome/**/*.map',
			'!node_modules/font-awesome/.npmignore',
			'!node_modules/font-awesome/*.txt',
			'!node_modules/font-awesome/*.md',
			'!node_modules/font-awesome/*.json'
		])
		.pipe(gulp.dest(path.dest + 'vendor/font-awesome'))

	gulp.src([
			path.src + '**/*.html', 
			path.src + '**/*.php',
			path.src + '**/*.js',
		])
		.pipe(gulp.dest(path.dest))

	gulp.src([path.src + 'css/*.css']).pipe(gulp.dest(path.dest + 'css'))
	gulp.src([path.src + 'img/*']).pipe(gulp.dest(path.dest + 'img'))
})

// gulp.task('php', function() {
//     php.server({ base: 'build', port: 8010, keepalive: true});
// });

// Run everything
gulp.task('default', [
	'less', 
	'minify-css', 
	'remove-css', 
	'minify-js', 
	'copy'
]);

// Configure the bSync task to run from the destination folder
gulp.task('bSync', function() {
	bSync.init({
		server: {
			baseDir: 'app/',
			open: false,
			host: '',
			// proxy: 'http://localhost/renova-bikes/app',
			port: 80
		},
	})
})

// Reloads the browser whenever source files change
gulp.task('dev', ['bSync', 'less', 'minify-css', 'minify-js'], function() {
	gulp.watch(path.src + 'less/*.less', ['less']);
	gulp.watch(path.src + 'css/*.css', ['minify-css']);
	gulp.watch(path.src + 'js/*.js', ['minify-js']);

	// Copy html and php files to destination 
	gulp.watch([
			path.src + '**/*.html',
			path.src + 'php/**/*.php',
			path.src + 'css/*.css',
		], 
		['copy']
	);
	// Since the individual lines of the `copy` task cannot be followed by
	// an inline reload, trigger them all manually here
	gulp.watch([
			path.dest + '**/*.html',
			path.dest + 'php/**/*.php',
			path.dest + 'css/*.css',
		])
		.on('change', bSync.reload);
});

// Compiles SCSS files from /scss into /css
// To switch from LESS to SCSS, change the 'less' task to 'sass'
gulp.task('sass', function() {
	return gulp.src('src/scss/agency.scss')
		.pipe(sass())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest('src/css'))
		.pipe(bSync.reload({
			stream: true
		}))
});
