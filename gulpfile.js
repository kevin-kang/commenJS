var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    connect = require('gulp-connect'),
    copy = require('gulp-copy'),
    plumber = require('gulp-plumber'), //有错误不中断gulp
    changed = require('gulp-changed'), // 仅仅传递更改过的文件
    webpackConfig = require('./webpack.config.babel.js'),
    devPath = 'src', //开发目录
    assets = 'dest', //上线目录
    paths = [devPath + '/*.html', devPath + '/**/*.+(scss|js|jpg|gif|png|svg)'];//文件路劲

webpackConfig.output.path = assets;//设置webpackconfig输出路径

webpackConfig.output.publicPath = '/' + assets + '/';//设置webpackconfig公共输出路径

//监听文件变化且自动刷新文件
gulp.task('watch', function() {
    var watcher = gulp.watch(paths, ['webpack']);
    watcher.on('change', function(){
        gulp.start('copy','livereload');
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

//copy开发目录下的images文件夹
gulp.task('copy', function() {
    gulp.src(devPath + '/images/**')
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(copy('../' + assets, {
            prefix: 1
        }));
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