const { parallel, series, src, dest } = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const imgBust = require('gulp-css-img-cachebust');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;

const path = require('path');

function compileMainCss() {
  return pipeline(
    src('./assets-src/css/style.less'),
    sourcemaps.init(),
    rename('compiled.css'),
    imgBust(),
    less({
      paths: [path.join(__dirname, 'assets-src', 'css', 'mixins')]
    }),
    cleanCSS({ compatibility: 'ie9' }),
    sourcemaps.write('./maps'),
    dest('./assets/css')
  );
}

function compilePrintCss() {
  return pipeline(
    src('./assets-src/css/print.less'),
    sourcemaps.init(),
    rename('compiled_print.css'),
    less({
      paths: [path.join(__dirname, 'assets-src', 'css', 'mixins')]
    }),
    cleanCSS({ compatibility: 'ie9' }),
    sourcemaps.write('./maps'),
    dest('./assets/css')
  );
}

function compileGlobalJs() {
  return pipeline(
    src([
      './assets-src/js/jquery-3.2.1.min.js',
      './assets-src/js/jquery-migrate-3.0.1.min.js',
      './assets-src/js/global.js'
    ]),
    sourcemaps.init(),
    concat('global.js'),
    babel({
			presets: ['@babel/preset-env']
		}),
    uglify(),
    sourcemaps.write('./maps'),
    dest('./assets/js')
  );
}

function compileAppJs() {
  return pipeline(
    src([
      './assets-src/js/service-worker.js'
    ]),
    sourcemaps.init(),
    babel({
			presets: ['@babel/preset-env']
		}),
    uglify(),
    sourcemaps.write('./maps'),
    dest('./assets/js')
  );
}

function compileKeyboardShortcutJs() {
  return pipeline(
    src('./assets-src/js/keyboard.js'),
    sourcemaps.init(),
    babel({
			presets: ['@babel/preset-env']
		}),
    uglify(),
    sourcemaps.write('./maps'),
    dest('./assets/js')
  );
}

function compileServiceWorkerJs () {
  return pipeline(
    src('./assets-src/js/keyboard.js'),
    sourcemaps.init(),
    babel({
			presets: ['@babel/preset-env']
		}),
    uglify(),
    sourcemaps.write('./maps'),
    dest('./assets/js')
  );

}

exports.default = parallel(
  compileMainCss,
  compilePrintCss,
  compileAppJs,
  compileGlobalJs,
  compileKeyboardShortcutJs,
  compileServiceWorkerJs
);
