# gulp模板 wiki

`gulp`是一款基于`node`流的自动化构建工具，可以将前端项目中的部分任务自动化完成

本模板使用`gulp`和其插件，完成一系列配置好的任务，实现静态文件转移，css、js和图像资源压缩，文件指纹更新，前端服务及api代理。

**本模板适用于前后端分离的项目，前后端耦合项目需在配置上进行调整**

## 运行环境/依赖

`gulp`是基于`node`环境的构建，需先安装 [node](http://nodejs.cn/)，[gulp](https://gulpjs.com/)

`node`及`gulp`安装好之后，运行`npm install`来装所需依赖

```JSON
// package.json
"devDependencies": {
  "gulp": "^4.0.2",
  "gulp-load-plugins": "^1.5.0",
  "gulp-clean": "^0.4.0",
  "gulp-connect": "^5.7.0",
  "http-proxy-middleware": "^0.19.1",
  "gulp-uglify": "^3.0.2",
  "gulp-clean-css": "^4.2.0",
  "gulp-imagemin": "^5.0.3",
  "imagemin-pngquant": "^8.0.0",
  "gulp-rev": "^9.0.0",
  "gulp-rev-collector": "^1.3.1",
  "gulp-rev-format": "^1.0.4"
}
```

## 结构

项目结构包含两套完整前端资源，以及 `gulp` 和 `package` 配置文件，`src` 目录包含所有源文件，`app` 目录是处理后的目录，可在`gulp`配置中更改目录

```
|—— app
|—— src
|—— —— script
|—— —— css
|—— —— img
|—— gulp
|—— package

```

## 配置
`gulp`配置及API请参考 [gulp](https://gulpjs.com/)

模板一共涉及到静态文件转移，css、js和图像资源压缩，文件指纹更新，前端服务及热更新功能。

### 静态文件转移
涉及到js库，json文件，config配置等不需要进行加工处理的文件，对应任务为`copyStatic`，常量`STATIC_DIR`收集需要转移的资源目录名。

**该方法会转移对应目录下所有资源**

### 文件压缩

对js，css，图像资源进行压缩，对应任务为`jsuglify`，`cssminify`和`imagemin`

**如果目录内有不需要进行压缩的内容，需要进行排除处理，并在其他任务中处理排除掉的文件**

### 指纹更新
在js和css的压缩过程中还进行指纹更新的操作，对文件发生变更的内容进行指纹更新

由于文件指纹的更新，最后对js，css和html的引入资源路径进行更新，对应任务为`revCss`，
`revJs`和`revHtml`，最后删除指纹对比文件`cleanRev`

### 前端服务及api代理
`gulp-connect`插件可以启动前端服务，`http-proxy-middleware`插件作为路由中间件可以对请求进行转发，模板中使用`filter`方法对请求进行了过滤，只对需要转发的请求尽心个转发，如果不需要过滤，删除该参数即可

[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
[gulp-connect](https://www.npmjs.com/package/gulp-connect)

## 使用
将`gulp`任务命令配置到`package`中

`npm run dev` 启动开发环境服务(`gulp`命令默认方法)
`npm run pro` 启动生产环境服务
`npm run build` 构建生产环境资源

