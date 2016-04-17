var webpack = require('webpack'),
    commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'js/[name].js'
    }),
    ExtractTextPlugin = require('./node_modules/extract-text-webpack-plugin'),
    ExtractSCSS = new ExtractTextPlugin('css/[name].css'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    config = {
        devtool: 'source-map',
        debug: true,
        entry: { //js入口
            index: './src/js/index.js'
            common: ['./src/scss/reset.scss','./src/js/util.js'] //提取公共js，css
        },
        output: {
            path: '', //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
            publicPath: '', //模板、样式、脚本、图片等资源对应的server上的路径
            filename: 'js/[name].js', //每个页面对应的主js的生成配置
            sourceMapFilename: 'js/[name].map'
        },
        plugins: [
            new webpack.ProvidePlugin({ //引入全局zepto
                $: 'webpack-zepto'
                    // $: 'Zepto'
            }),
            commonsPlugin, // 提取公共js文件
            ExtractSCSS, //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
            //压缩js
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
                // favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
                filename: './index.html', //生成的html存放路径，相对于path
                template: 'src/index.html', //html模板路径
                inject: true, //js插入的位置，true/'head'/'body'/false
                hash: true, //为静态资源生成hash值
                chunks: ['common','index'], //需要引入的chunk，不配置就会引入所有页面的资源
                minify: {
                    removeComments: true, //移除HTML中的注释
                    collapseWhitespace: true
                }
            })
        ],
        module: {
            loaders: [
                {//编辑压缩小于10k的文件为data:image格式
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'url?limit=10000&name=css/img/[name].[ext]?[hash]'

                },
                { //编译html文件为字符串
                    test: /\.html$/,
                    loader: 'html'
                }, 
                { //编译es6文件
                    test: /\.js?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015'],
                        plugins: ['transform-runtime'],
                        sourceMaps: 'both'
                    }
                },
                {//编译SCSS生成link链接
                    test: /\.scss$/,
                    loader: ExtractSCSS.extract('style', 'css!sass?sourceMap') 
                }
            ]
        },
        sassLoader: { //压缩css
            outputStyle: 'compressed'
        }
    };

module.exports = config;