## module目录：
module目录下所有的js为ES6写法，使用时请注意测试可能个别文件有问题。

## package.json 
为基础引用包，可能会根据项目不同有所增加，已增加通过babel配置项使得gulpfile能支持ES6语法

## gulpfile.js 主要功能：
server服务，webpack打包服务，自动刷新浏览器。

## gulpfile.js 跟进项目修改地方为：
webpackConfig字段，devPath字段，assets字段。

## webpack.config.js 主要功能：
scss编译打包，ES6编译打包，静态文件压缩拷贝，HTML文件模板及自动追加link和script。

## webpack.config.js 根据项目修改地方为：
HtmlWebpackPlugin 插件增减，webpack.ProvidePlugin 插件对$引用修改，modules下的loaders 加载器修改