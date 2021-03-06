'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const html_template_generator = require('./plugin/generate.html.template')
const map_json_generator = require('./plugin/generate.map')
const UglifyJsparallelPlugin = require('webpack-uglify-parallel');
const os = require('os');

const env = config.build.env

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true // 在这里和vue部分控制是否要将css文件独立出来
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    // filename: utils.assetsPath('js/[name]_[chunkhash]/[name].js'), //让生成的js按文件名分开，方便查找
    filename: utils.assetsPath('js/[name]_[chunkhash].js'), //让生成的js按文件名分开，方便查找
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    //publicPath : config.projectConfig.static_root + "/",// 静态资源地址
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
      'process.domain': config.projectConfig.domain,
    }),
    // 混淆，压缩代码
    // old
    new UglifyJsparallelPlugin({
        // 多进程压缩js，可以将编译速度提高三倍
        workers: os.cpus().length,
        compress: {
            warnings: false,
        },
        sourceMap: true
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // 用于将css单独打包到一个文件内，但因为现在不单独生成css，所以可以注掉
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
  ].concat(html_template_generator.generate_html_template_list(env)).concat([
    // 只生成一个js文件
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
     name: 'vendor',
     minChunks: function (module, count) {
       // any required modules inside node_modules are extracted to vendor
       return (
         module.resource &&
         /\.js$/.test(module.resource) &&
         module.resource.indexOf(
           path.join(__dirname, '../node_modules')
         ) === 0
       )
     }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'manifest',
    //  chunks: ['vendor']
    //}),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
    // map.json插件
    map_json_generator.generate_map_json({
      // output file path, relative to process.cwd()
      // output: './map/' + config.projectConfig.name + '/map-' + config.projectConfig.version + '.json',
      output: './map/' + config.projectConfig.directory + '/map-' + config.projectConfig.version + '.json',
      assetsPath: config.build.assetsPublicPath, // 文件前缀地址
      static_root: config.projectConfig.static_root, // 静态资源根路径
    })
  ])
})
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = webpackConfig