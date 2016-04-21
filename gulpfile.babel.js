import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import connect from 'gulp-connect';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import webpackConfig from './webpack.config.js';

let devPath = 'src', //开发目录
    assets = 'dest', //上线目录
    paths = [`${devPath}/*.html`, `${devPath}/**/*.+(scss|js|jpg|gif|png|svg)`];//文件路劲

webpackConfig.output.path = assets;//设置webpackconfig输出路径

webpackConfig.output.publicPath = `/${assets}/`;//设置webpackconfig公共输出路径

//监听文件变化且自动刷新文件
gulp.task('watch', () => {
    gulp.watch(paths, ['livereload'], event => {
        console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

//自动刷新任务
gulp.task('livereload', ['copy'], () => {
    gulp.src(paths)
        //'changed' 任务需要提前知道目标目录位置
        // 才能找出哪些文件是被修改过的
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(connect.reload());
});

//copy开发目录下的images文件夹 先执行webpack，再执行copy
gulp.task('copy', ['webpack'], () => {
    return gulp.src(`${devPath}/images/**`)
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(gulp.dest(assets +'/images'));
});

//webpack打包任务
gulp.task('webpack', cb => {
    return webpack(webpackConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        cb();
    });
});

//静态服务器 默认端口为：8080
gulp.task('server', () => {
    connect.server({
        livereload: true
    });
});

// 运行任务
gulp.task('default', () =>{
    gulp.start('server','watch');
});