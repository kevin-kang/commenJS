import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import connect from 'gulp-connect';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import apiUrl from './config.json'; //配置不同环境下的API接口 默认dev ->本地环境，test ->测试环境，repro ->准生成环境，pro ->生成环境
import opt from 'minimist'; //获取命令行参数

let args = process.argv.slice(2),
    argsOpt = opt(args),
    basePaths = `${args[2]}` == 'undefined' ? `${args[1]}` : `${args[2]}`,
    webpackConfig = require(`./webpack.config/webpack.config.${basePaths}.babel.js`), //根据gulp参数获取不同webpack配置文件
    devPath = `src/${basePaths}`, //开发目录
    dest = `dest/${basePaths}`, //本地编译后目录
    testPath = `test/${basePaths}`, //测试环境目录
    reproPath = `repro/${basePaths}`, //准生成环境目录
    proPath = `pro/${basePaths}`, //生成环境目录
    assets = dest, //默认目录为本地dest目录
    paths = [`${devPath}/*.html`, `${devPath}/**/*.+(scss|js|jpg|gif|png|svg)`, `!${devPath}/**/config.js`]; //文件路劲

let string_src = (filename, string) => { //把特定的字符转成流
    let src = require('stream').Readable({
        objectMode: true
    })
    src._read = function() {
        this.push(new gutil.File({
            cwd: '',
            base: '',
            path: filename,
            contents: new Buffer(string)
        }));
        this.push(null);
    }
    return src;
};

if (argsOpt.test) {
    assets = testPath;
}
if (argsOpt.repro) {
    assets = reproPath;
}
if (argsOpt.pro) {
    assets = proPath;
}

webpackConfig.default.output.path = assets; //设置webpackconfig输出路径

webpackConfig.default.output.publicPath = argsOpt.test || argsOpt.repro || argsOpt.pro ? `/` : `/${assets}/`; //设置webpackconfig公共输出路径

gulp.task('constants', () => {
    //取出对应的配置信息
    let envConfig, conConfig;

    if (argsOpt.test) {
        envConfig = apiUrl.test;
    } else if (argsOpt.repro) {
        envConfig = apiUrl.repro;
    } else if (argsOpt.pro) {
        envConfig = apiUrl.pro;
    } else {
        envConfig = apiUrl.dev;
    }

    conConfig = `let baseUrl = { url: ${JSON.stringify(envConfig)}}; export default baseUrl;`;

    //生成config.js文件
    return string_src('config.js', conConfig)
        .pipe(gulp.dest(`${devPath}/js/`));
});

//监听文件变化且自动刷新文件
gulp.task('watch', () => {
    let watcher = gulp.watch(paths, ['livereload']);

    watcher.on('change', event => {
        console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

//自动刷新任务
gulp.task('livereload', ['copy'], () => {
    gulp.start('help');
    return gulp.src(paths)
        //'changed' 任务需要提前知道目标目录位置
        // 才能找出哪些文件是被修改过的
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(connect.reload());

});

//copy开发目录下的images文件夹 先执行webpack，再执行copy
gulp.task('copy', ['webpack'], () => {
    return gulp.src([`${devPath}/images/**`, `${devPath}/releasepackage/**`], {
            base: `${devPath}`
        })
        .pipe(changed(assets))
        .pipe(plumber())
        .pipe(gulp.dest(assets));
});

//webpack打包任务
gulp.task('webpack', cb => {
    return webpack(webpackConfig.default, (err, stats) => {
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

// 运行默认任务 
// gulp --dev mobile 第一个参数为打包开发环境，第二个参数为输入输出的目录
gulp.task('default', ['constants'], () => {
    gulp.start('server', 'watch', 'help');
});

//打包测试，准生成，生产环境 --test, --repro, --pro 三个参数
//gulp allpack --test mobile 第一个参数为打包测试环境，第二个参数为要打包的目录
gulp.task('allpack', ['constants'], () => {
    gulp.start('copy');
});

gulp.task('help', () => {
    console.log('++++++++++++++++++++++++++++++++');
    console.log('xxx代表目录名');
    console.log('gulp --dev xxx 开启本地静态服务器和自动刷新功能以及打包');
    console.log('gulp --test xxx 测试服务器打包');
    console.log('gulp --repro xxx 准生产服务器打包');
    console.log('gulp --pro xxx 生产服务器打包');
    console.log('++++++++++++++++++++++++++++++++');
});