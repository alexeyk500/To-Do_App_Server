############################################################################################################
Запуск нового проекта с Gulp
------------------------------------------------------------------------------------------------------------
1) Создаем папку нового проекта

2) Копируем:
    a)  "#src"          - папку c исходниками
    б)  "gulpfile.js"   - файл с пайплайном gulp
    в)  "package.json   - файл с описанием проекта и описаниями используемых плагинов Gulp
    г)  "readmy.md"     - этот файл с инструкциями
    д)  ".editorconfig" - файл с настройками редактора кода
    e)  ".gitignore"    - файл файлов и папок игнортруемых Git

3) Открываем папку проекта в VScode

4) Правим в "package.json
    a) "name":         - "сюда_Имя_проекта"
    б) "description":  - "сюда_описание_проекта"

5) Устанавливаем требуемые плагины для Gulp
  $ npm i

6) Запускаем Gulp
  $ gulp

############################################################################################################
Первоначальное создание проекта

1) Активируем проект папке проекта
    $ npm init
1.1) Заполняем файл pakage.json и сохраняем его.

2) Устанавливаем gulp для проекта
    $ npm install gulp --save-dev

3) Определяем структуру папок проекта (#src - папка исходников, app - папка для запуска приложения)
    |- #src/
     |- img/
     |- js/
     |- scss/
     |- index.html

4) Устанавливаем плагины:
  a) browser-sync                  // синхронизация браузера
  b) gulp-file-include             // сборка выходного файла из исходных
  c) del                           // удаление ненужных файлов
  d) gulp-sass                     // препроцесор sass и scss
  e) gulp-autoprefixer             // css автопрефиксер
  f) gulp-group-css-media-queries  // сборщик медиазапросов в конец css файла
  g) gulp-clean-css                // оптимизация и очистка css
  h) gulp-rename                   // переименование файлов
  i) gulp-uglify-es                // ужатие js
  k) gulp-imagemin                 // ужатие картинок
  l) gulp-webp                     // перевод изображений в формат webp
  m) gulp-webp-html                // поключение изображений webp в html
  n) gulp-ttf2woff                 // конвертор шрифтов ttf
  o) gulp-ttf2woff2                // конвертор шрифтов ttf
  p) gulp-fonter                   // конвертор шрифтов otf
  
  Все плагины в одну строку
  $ npm i browser-sync gulp-file-include del gulp-sass gulp-autoprefixer gulp-group-css-media-queries gulp-rename gulp-uglify-es gulp-imagemin gulp-webp gulp-webp-html gulp-ttf2woff gulp-ttf2woff2 gulp-fonter --save-dev 

5) Создаем файл gulpfile.js и далее в нем прописываем все инструкции



ОШИБКИ в VS-Code 

1) убрать ошибку Doctype-first - HTML
Go to your VScode Preferences > Settings > Htmlhint: Document Selector: 
"htmlhint.options": { "doctype-first": false }

2) убрать ошибку experimentalDecorators - JS - не работает
In VSCode go to preferences -> settings, you will see an option to enable/disable experimentalDecorators. Check it and save the settings file. Done


