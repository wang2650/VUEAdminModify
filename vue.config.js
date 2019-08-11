'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
function resolve(dir) {
  return path.join(__dirname, dir)
}



module.exports = {
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    // indexPath : 'index.html',
    publicPath: './',
    outputDir: 'dist',
    // indexPath: '#/login',
    productionSourceMap: false,
    lintOnSave: process.env.NODE_ENV === 'development',
    devServer: {
        port: 8889,
        host:'127.0.0.1',
        open: false,
        overlay: {
          warnings: false,
          errors: true
        },
        proxy:process.env.WEB_API_URL
        
    },
    configureWebpack: {
      plugins:[
          new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "windows.jQuery":"jquery"
          })
        ],
        resolve: {
          alias: {
            '@': resolve('src')
          }
        }
    },
    chainWebpack(config) {
        const cdn = {
          // inject tinymce into index.html
          // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
          js: ['https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.2/tinymce.min.js']
        }
        config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn
          return args
        })
        
        config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
  
      // set preserveWhitespace
      config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
        .end()
  
      config
        // https://webpack.js.org/configuration/devtool/#development
        .when(process.env.NODE_ENV === 'development',
          config => config.devtool('cheap-source-map')
        )
  
      config
        .when(process.env.NODE_ENV !== 'development',
          config => {
            config
              .plugin('ScriptExtHtmlWebpackPlugin')
              .after('html')
              .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
                inline: /runtime\..*\.js$/
              }])
              .end()

            config
              .optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                  libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // only package third parties that are initially dependent
                  },
                  elementUI: {
                    name: 'chunk-elementUI', // split elementUI into a single package
                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                  },
                  commons: {
                    name: 'chunk-commons',
                    test: resolve('src/components'), // can customize your rules
                    minChunks: 3, //  minimum common number
                    priority: 5,
                    reuseExistingChunk: true
                  }
                }
              })
            config.optimization.runtimeChunk('single')
        }
        )
    }
  }
  