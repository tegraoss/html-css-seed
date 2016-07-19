import gulp from 'gulp';
import pug from 'gulp-pug';
import gls from 'gulp-live-server';
import rimraf from 'gulp-rimraf';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

gulp.task('clean', () =>
  gulp.src(['public/*'], {
    read: false
  })
  .pipe(rimraf())
);

gulp.task('pug', () =>
  gulp.src('src/pug/**/*.pug')
    .pipe(
      pug({ pretty: true })
    )
    .pipe(gulp.dest('public/'))
);

gulp.task('scss', () =>
  gulp.src(['src/scss/**/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    "browsers": ["last 4 version"]
  }))
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest('public/css/'))
);

gulp.task('watch', () => {
  const server = gls.static('public', 3000);
  server.start();

  gulp.watch(['src/pug/*.pug'], { usePolling: true }, gulp.parallel('pug'));
  gulp.watch(['src/scss/*.scss'], { usePolling: true }, gulp.parallel('scss'));

  gulp.watch(['public/**/*.css', 'public/**/*.html']).on('change', (path) => {
    server.notify({
      path
    });
  });

  gulp.watch('public/**/*.js', server.start.bind(server));
});

gulp.task('default', gulp.series('clean', gulp.parallel('scss', 'pug'), 'watch'));
