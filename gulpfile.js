var gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    copy = require('gulp-copy'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'), //有错误不中断gulp
    changed = require('gulp-changed'), // 仅仅传递更改过的文件
    webpackConfig = require('./webpack.config.babel.js'),
    // webpackConfig = require('./webpack.config.js'),
    // px3rem = require('gulp-px3rem');
    devPath = 'H5epay', //开发目录
    assets = 'assetsH5', //上线目录
    initCompressImgCounter = 0, // 压缩图片初始次数
    maxCompressImgCounter = 1, // 压缩图片最大次数
    paths = [devPath + '/*.html', devPath + '/**/*.{scss,js}']; //文件路劲

webpackConfig.output.path = assets;//设置webpackconfig输出路径

webpackConfig.output.publicPath = '/' + assets + '/';//设置webpackconfig公共输出路径

//监听文件变化且自动刷新文件
gulp.task('watch', function() {
    var watcher = gulp.watch(paths, ['webpack']);
    watcher.on('change', function(){
        gulp.start('livereload');
    });
});

//自动刷新任务
gulp.task('livereload', function() {
    gulp.src(paths)
        //'changed' 任务需要提前知道目标目录位置
        // 才能找出哪些文件是被修改过的
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(connect.reload());
});

//webpack打包任务
gulp.task('webpack', function(cb) {
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        cb();
    });
});

//静态服务器 默认端口为：8080
gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

// 运行任务
gulp.task('default',function(){
    gulp.start('server','watch');
});