import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";              
import sourcemaps from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import htmlmin from "gulp-htmlmin";
import plumber from "gulp-plumber";
import ts from "gulp-typescript";
import terser from "gulp-terser";
import concat from "gulp-concat";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import gulpIf from "gulp-if";

const bs = browserSync.create();
const isProd = process.env.NODE_ENV === "production";

const paths = {
  html: "src/**/*.html",
  images: "src/images/**/*",
  scss: "src/scss/**/*.scss",
  ts: "src/ts/**/*.ts",
  data: "src/data/**/*.json",
  dist: "dist",
};

const sassCompiler = gulpSass(dartSass);     

const tsProject = ts.createProject("tsconfig.json");

export function clean() {
  return deleteAsync([paths.dist]);
}

export function styles() {
  return gulp
    .src("src/scss/main.scss", { allowEmpty: true })
    .pipe(plumber())
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sassCompiler.sync().on("error", sassCompiler.logError))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulpIf(!isProd, sourcemaps.write(".")))
    .pipe(gulp.dest(`${paths.dist}/assets/css`))
    .pipe(bs.stream());
}

export function scripts() {
  return gulp
    .src(paths.ts, { allowEmpty: true })
    .pipe(plumber())
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(tsProject())
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulpIf(!isProd, sourcemaps.write(".")))
    .pipe(gulp.dest(`${paths.dist}/assets/js`))
    .pipe(bs.stream());
}

export function html() {
  return gulp
    .src(paths.html, { allowEmpty: true })
    .pipe(plumber())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());
}

export function images() {
  return gulp
    .src(paths.images, { allowEmpty: true })
    .pipe(gulp.dest(`${paths.dist}/images`))
    .pipe(bs.stream());
}

export function data() {
  return gulp
    .src(paths.data, { allowEmpty: true })
    .pipe(gulp.dest(`${paths.dist}/data`))
    .pipe(bs.stream());
}

export function serve() {
  bs.init({
    server: { baseDir: paths.dist },
    open: false,
    port: 3000,
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.ts, scripts);
  gulp.watch(paths.html, html);
  gulp.watch(paths.images, images);
  gulp.watch(paths.data, data);
}

export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, html, images, data)
);

export const dev = gulp.series(build, serve);

export default build;
