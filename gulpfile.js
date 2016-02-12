var gulp = require('gulp')
  , babelify = require('babelify')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , less = require("gulp-less")
  , path = require('path')
  , rename = require("gulp-rename")
  , LessPluginAutoPrefix = require('less-plugin-autoprefix')
  , LessPluginCleanCSS = require('less-plugin-clean-css')
  , cleancss = new LessPluginCleanCSS({ advanced: true })
  , autoprefix = new LessPluginAutoPrefix({browsers: ["last 2 versions"]})
  , gulpif = require("gulp-if")
  , sprity = require("sprity");


gulp.task('css', function () {
  return gulp.src('src/style/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix]
    }))
    .pipe(rename("dinpo.css"))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css-min', function () {
  return gulp.src('src/style/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix, cleancss]
    }))
    .pipe(rename("dinpo.min.css"))
    .pipe(gulp.dest('dist/css'));
});

gulp.task("less-both", ["less", "less-min"]);


gulp.task("build-js", function() {
  compileReact("src/js/app.js", false);
});

gulp.task("watch-js", function() {
  compileReact("src/js/app.js", true);
});


function compileReact(file, watch) {


  var b = browserify("./" + file,
    {
      extensions: ['.jsx'],
      cache: {},
      packageCache: {}
    })
    .transform( babelify, {
      plugins: ["add-module-exports"],
      presets: [ 'es2015', 'stage-0', 'react']
    });


  if(watch){
    b.plugin(watchify);

    b.on("log", function(msg){
      console.log(msg);
    });

    b.on("update", rebundleReact);
  }

  function rebundleReact() {
    b.bundle()
     .on("error", function(err){ console.error(err.message)})
     .pipe(source("dinpo.js"))
     .pipe(gulp.dest("./dist/js/"));
  }

  rebundleReact();
}


gulp.task('sprites', function () {
  return sprity.src({
    src: 'src/images/*.{png,jpg}',
    style: 'sprites.less',
    name: 'dinpo-sprite',
    prefix: 'dinpo-icon',
    orientation: 'binary-tree',
    'processor': 'less'
  })
  .pipe(gulpif('*.png', gulp.dest('./dist/img/'), gulp.dest('./dist/css/')))
});