const path = require('path');
const webpack = require('webpack');

const resolve = dir => {
    return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 引入插件
module.exports = {
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        proxy: {
            // 匹配代理的url
            '/api': {
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/api': '/api'
                },
                changeOrigin: true
            },
            '/ws': {
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/api': '/api'
                },
                changeOrigin: true
            },
            '/Image': {
                // 图片路径代理
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/Image': '/Image'
                },
                changeOrigin: true
            },
            '/mpImg': {
                // 图片路径代理
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/mpImg': '/mpImg'
                },
                changeOrigin: true
            },
            '/wxapi': { // 微信相关接口代理
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/wxapi': '/wxapi'
                },
                changeOrigin: true
            },
            '/Template': {
                // 目标服务器地址
                target: 'http://test-core.51yunxi.cn/',
                // 路径重写
                pathRewrite: {
                    '^/Template': '/Template'
                },
                changeOrigin: true
            }
        }
    },
    // Project deployment base
    // By default we assume your app will be deployed at the root of a domain,
    // e.g. https://www.my-app.com/
    // If your app is deployed at a sub-path, you will need to specify that
    // sub-path here. For example, if your app is deployed at
    // https://www.foobar.com/my-app/
    // then change this to '/my-app/'
    configureWebpack: {    
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            // drop_console: true, // console
                            drop_debugger: false,
                            // pure_funcs: ['console.log'] // 移除console
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'root.jQuery': 'jquery'
            })
        ]
    },
    publicPath: '/',
    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: true,
    runtimeCompiler: true,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')); // key,value自行定义，比如.set('@@', resolve('src/components'))
        //   .set('_c', resolve('src/components'))
        if(process.env.NODE_ENV ==='production'){
            if(process.env.npm_config_report){
                config
                    .plugin('webpack-bundle-analyzer')
        
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        
                    .end();
        
                config.plugins.delete('prefetch');
            }
        
        }
         
    },
    // 打包时不生成.map文件
    productionSourceMap: false
};
