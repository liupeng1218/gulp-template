const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const plugins = require('gulp-load-plugins')()
const proxy = require('http-proxy-middleware')
const pngquant = require('imagemin-pngquant')
const {
  series,
  src,
  dest
} = require('gulp')

const PATH = {
  srcPath: 'src/',
  proPath: 'app/'
}

/* definition constant */

const ROUTE_ARRAY = []
const STATIC_DIR = []

// clean dist
function clean () {
  return src([PATH.proPath])
    .pipe(plugins.clean())
}

// copy static
function copyStatic () {
  const path = PATH.srcPath + '/@(' + STATIC_DIR.join('|') + ')/**'
  return src(path)
    .pipe(dest(PATH.proPath))
}

// uglify js
function jsuglify () {
  return src([PATH.srcPath + 'script/**']) // 要压缩的js文件
    .pipe(plugins.uglify()) // 使用uglify进行压缩
    .pipe(rev())
    .pipe(dest(PATH.proPath + 'script/')) // 压缩后的路径
    .pipe(rev.manifest())
    .pipe(dest(PATH.proPath + '/rev/js'))
}
// uglify css
function cssminify () {
  return src([PATH.srcPath + 'css/**/*.css']) // 要压缩的css文件
    .pipe(plugins.cleanCss({
      compatibility: 'ie8',
      inline: false
    })) // 使用cleanCss进行压缩
    .pipe(rev()) // 文件名加MD5后缀
    .pipe(dest(PATH.proPath + 'css')) // 压缩后的路径
    .pipe(rev.manifest()) // 生成一个rev-manifest.json文件，记录MD5的文件改名前后的对应关系
    .pipe(dest(PATH.proPath + '/rev/css')) // 将 rev-manifest.json 保存到 rev
}
// uglify image
function imagemin () {
  return src(PATH.srcPath + 'img/**') // 要压缩的img文件
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }], // 不要移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant深度压缩png图片的imagemin插件
    })) // 使用imagemin进行压缩
    .pipe(dest(PATH.proPath + 'img')) // 压缩后的路径
}
// rev asset
function revCss () {
  return src([PATH.proPath + 'rev/**/*.json', PATH.proPath + 'css/import*.css'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(dest(PATH.proPath + 'css'))
}

function revJs () {
  return src([PATH.proPath + 'rev/**/*.json', PATH.proPath + 'script/control/import*.js'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(dest(PATH.proPath + 'script/control'))
}

function revHtml () {
  return src([PATH.proPath + 'rev/**/*.json', PATH.srcPath + '**/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(dest(PATH.proPath))
}

// clean rev file
function cleanRev () {
  return src([PATH.proPath + 'rev'])
    .pipe(plugins.clean())
}

/**
 * proxy route filter
 * @pathname url
 */
const filter = function (pathname) {
  return ROUTE_ARRAY.some((item) => {
    return pathname.indexOf(item) >= 0
  })
}

function dev () {
  plugins.connect.server({
    name: 'dev App',
    root: PATH.srcPath,
    port: 8080,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        proxy(filter, {
          target: '',
          changeOrigin: true
        })
      ]
    }
  })
}

function pro () {
  plugins.connect.server({
    name: 'pro App',
    root: PATH.proPath,
    port: 8080,
    middleware: function (connect, opt) {
      return [
        proxy(filter, {
          target: '',
          changeOrigin: true
        })
      ]
    }
  })
}
exports.build = series(clean, copyStatic, jsuglify, cssminify, imagemin, revCss, revJs, revHtml, cleanRev)

exports.pro = series(pro)

exports.dev = series(dev)

exports.default = series(dev)
