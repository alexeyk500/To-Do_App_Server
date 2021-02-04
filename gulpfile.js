// Папка Исходников и пака вывода
let source_folder  = "#src";
// Выходная папка повторит имя папки в которой проект
let project_folder = require("path").basename(__dirname); //"app";

//  Присваиваем перменным gulp плагины
let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify_js = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  // webp = require('gulp-webp'),
  // webp_html = require('gulp-webp-html'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2');

// Пути к файлам в проекте
let path={
  // Пути к исходникам
  src:{
    html:  [source_folder+"/*.html", "!" + source_folder+"/_*.html"],
    css:   source_folder+"/scss/style.scss",
    js:    source_folder+"/js/todo-app.js",
    img:   source_folder+"/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
    fonts: source_folder+"/fonts/*.ttf",
  },
  // пути вывода
  build:{
    html:  project_folder+"/",
    css:   project_folder+"/css/",
    js:    project_folder+"/js/",
    img:   project_folder+"/img/",
    fonts: project_folder+"/fonts/",
  },
  // пути к отслеживаемым файлам
  watch:{
    html:  source_folder+"/**/*.html",
    css:   source_folder+"/scss/**/*.scss",
    js:    source_folder+"/js/**/*.js",
    img:   source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  // путь для очистки предыдущих файлов
  clean: "./" + project_folder + "/"
};

// вывод в браузер
function brouserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3500,
    notify: false
  })
};

// Обработка html файлов
function html() {
  return src(path.src.html)
    // соединение html файлов
    .pipe(fileinclude())
    // // подключение webp в html
    // .pipe(webp_html())
    // копирование html файлов в выходную папаку
    .pipe(dest(path.build.html))
    // рендеринг браузера
    .pipe(browsersync.stream())
};

// Обработка scss файлов
function css() {
  return src(path.src.css)
    // Препроцессим scss в css
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    // групируем медиазапросы
    .pipe(
      group_media()
    )
    // Добавляем автопрефиксы
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    // выгружаем "человеческий" css
    .pipe(dest(path.build.css))
    // // ужимаем и чистим "человеческий" css
    // .pipe(
    //   clean_css()
    // )
    // // добавляем к ужатому css префикс .min.css
    // .pipe(
    //   rename({
    //     extname: ".min.css"
    //   })
    // )
    // // выгружаем ужатый .min.css
    // .pipe(dest(path.build.css))
    // рендерим браузер
    .pipe(browsersync.stream())
};

// Обработка js файлов
function js() {
  return src(path.src.js)
    // обьединяем js файлы
    .pipe(fileinclude())
    // выгружаем собранный человеческий js файл
    .pipe(dest(path.build.js))
    // // ужимаем собранный человеческий js файл
    // .pipe(
    //   uglify_js()
    // )
    // // добавляем к ужатому css префикс .min.css
    // .pipe(
    //   rename({
    //     extname: ".min.js"
    //   })
    // )
    // // сораняем ужатый js файл
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

// Обработка изображений
function images() {
  return src(path.src.img)
    // // преобразуем изображения в webp формат
    // .pipe(
    //   webp({
    //     quality: 70
    //   })
    // )
    // // сохраняем изображения в webp в папку с картинками
    // .pipe(dest(path.build.img))
    // // повторно получаем исходные изображения
    // .pipe(src(path.src.img))
    // ужимаем изображения
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    // сохраняем сжатые изображения в папку с картинками
    .pipe(dest(path.build.img))
    // рендерим браузер
    .pipe(browsersync.stream())
};

// Конвертация шрифтов
function fonts() {
  src(path.src.fonts)
    // конвертация woff файлов
    .pipe(ttf2woff())
    // копирование html файлов в выходную папаку
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    // конвертация woff2 файлов
    .pipe(ttf2woff2())
    // копирование html файлов в выходную папаку
    .pipe(dest(path.build.fonts))
};

// Очистка - удаление выходной папки проекта со всеми ее подпапками и файлами
function clean(params){
  return del(path.clean);
}

// Отслеживание изменений в файлах
function watchFiles(params){
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], images)
};

let build = gulp.series(clean, gulp.parallel(images, fonts, js, css, html));
let watch = gulp.parallel(build, watchFiles, brouserSync);

exports.js      = js;
exports.css     = css;
exports.html    = html;
exports.build   = build;
exports.watch   = watch;
exports.fonts   = fonts;
exports.images  = images;
exports.default = watch;

