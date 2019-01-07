// Include gulp
var gulp = require("gulp");

// Include Our Plugins
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var autoprefixer = require('autoprefixer-core');
var rigger = require('gulp-rigger');
var minify = require('gulp-minify');
var minifyCSS=require('gulp-minify-css');
var rename = require("gulp-rename"); //minify elediyimiz dosyanın adını değiştirmek için kullandık bunu
var concat = require('gulp-concat'); //tüm js dosyalarını birleştirip all.js diye bir js dosyasında toplamak için
var flatten = require('gulp-flatten'); //fondaki klasör altında olan fontları tek klasöre toplamak için


var path = {
    build: { //Burada işlemden sonra bitmiş dosyaların nereye koyulacağını gösteriyoruz
        html: 'build/',
        js: 'build/frq-templates/js/',
        vendor: 'build/frq-templates/js/vendor/', //src deki vendor klasörünü buildeki vendor klasörüne eklemek için
        css: 'build/frq-templates/css/main/',
        images: 'build/frq-templates/img/',
        fonts: 'build/frq-templates/fonts/',
        libs: 'build/frq-templates/libs/' //bower ile src klasörüne yüklediğim dosyaları build klasörüne eklemek için
    },
    src: { //Burası kaynaklar
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/frq-templates/js/main/**/*.js',
        vendor: 'src/frq-templates/js/vendor/*.js',
        css: 'src/frq-templates/css/main.scss',
        images: 'src/frq-templates/img/**/*.*',
        fonts: 'src/frq-templates/fonts/**/*.*',
        libs: 'src/frq-templates/libs/**/'
    },
    watch: { //Burada izlemek istediğimiz dosyaları belirtiyoruz
        html: 'src/**/*.html',
        js: 'src/frq-templates/js/main/*.js',
        vendor: 'src/frq-templates/js/vendor/*.js',
        css: 'src/frq-templates/css/**/*.scss',
        images: 'src/frq-templates/img/**/*.*',
        fonts: 'src/frq-templates/fonts/**/*.*',
        libs: 'src/frq-templates/libs/'
    },
};


gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(rigger()) //rigger ile dosyaları birleşdiriyoruz header footer gibi komponentleri import ediyoruz bir nevi
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
});



gulp.task('js:build', function () {
    gulp.src(path.src.js) //burdakileri al derle

        .pipe(concat('all.js'))
        .pipe(gulp.dest(path.build.js)) //minify etmeden all.js dosyasını ekledik aşağıdaki noSource: true  komutunu silersek buna gerek olmayacak sanırım denemedim ama mantık olarak o kod minify olunmamışını eklemesini engelliyor
        .pipe(minify({
            ext:{

                min:'.min.js'
            },
            noSource:true //bu build altındaki js klasörüne düşen index.js yi düşürmüyor sadece min olan düşüyor
        }))


        .pipe(gulp.dest(path.build.js)); //derlenmiş dosyayı buraya at
});



gulp.task('css:build', function () {
    gulp.src(path.src.css) //Bizim main.scss seçer
        .pipe(sass()) //sass da derler
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(postcss([ autoprefixer({ browsers: ["> 0%"] }) ]))
        .pipe(gulp.dest(path.build.css))
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(path.build.css)); //build deki css e atar
});



gulp.task('image:build', function () {
    gulp.src(path.src.images) //resimleri seçer
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(gulp.dest(path.build.images));
});

gulp.task('libs:build', function () {
    gulp.src(path.src.libs)
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(gulp.dest(path.build.libs));
});


gulp.task('vendor:build', function () {
    gulp.src(path.src.vendor)
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(gulp.dest(path.build.vendor));
});



gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .on('error', function(err) {
            console.log(err)
            this.emit('end')
        })
        .pipe(flatten())
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'fonts:build',
    'image:build',
    'libs:build',
    'vendor:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.images], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });

    watch([path.watch.libs], function(event, cb) {
        gulp.start('libs:build');
    });

    watch([path.watch.vendor], function(event, cb) {
        gulp.start('vendor:build');
    });
});


gulp.task('default', ['build', 'watch']);