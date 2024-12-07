'use strict'

import gulp from 'gulp'
import log from 'fancy-log'
import mocha from 'gulp-mocha'
import hf from 'gulp-headerfooter'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import beautify from 'gulp-beautify'
import eslint from 'gulp-eslint'

const DEST = 'dist/'

const paths = ['gulpfile.js', 'src/dot-object.js', 'test/**/*.js']

gulp.task('lint', function (done) {
  gulp.src(paths)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  done()
})

gulp.task('mocha', function (done) {
  gulp.src(['test/**/*.js'])
    .pipe(mocha())
    .on('error', log)
  done()
})

gulp.task('watch', function () {
  gulp.watch(paths, gulp.series('build-node', 'mocha'))
})

gulp.task('build-node', function (done) {
  gulp.src('src/dot-object.js')
    .pipe(hf.footer('\nmodule.exports = DotObject\n'))
    .pipe(rename({ basename: 'index' }))
    .pipe(gulp.dest('./'))
  done()
})

gulp.task('build-bower', function (done) {
  gulp.src('src/dot-object.js')
    .pipe(hf.header('src/header.tpl'))
    .pipe(hf.footer('src/footer.tpl'))
    .pipe(beautify({ indentSize: 2 }))
    .pipe(gulp.dest(DEST))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST))
  done()
})

gulp.task('dist', gulp.parallel('lint', 'build-node', 'mocha', 'build-bower'))

gulp.task('test', gulp.parallel('lint', 'build-node', 'mocha'))

gulp.task('default', gulp.parallel('test'))
