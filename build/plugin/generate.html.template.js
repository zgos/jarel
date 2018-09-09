"use strict"
/**
 * Created by weizhua on 2017/9/28.
 */

let config = require('../../config')
let HtmlWebpackPlugin = require('html-webpack-plugin')
const imgeData = require('./skeleton')
// let template = config.projectConfig.project[project] 
//   ? config.projectConfig.project[project] + '/index.html'
//   : './src/index.html'

  // 生成html模版配置
  // 传入参数env : 当前环境配置信息
exports.generate_html_template_list = function(env) {
  // 根据配置生成不同的html
  var template_list = [];
  for (var project of Object.keys(config.projectConfig.project)) {
    console.log(config.projectConfig.project[project]);
    
    var html_template_config = {
      title: config.projectConfig.title, //用于生成的HTML文档的标题
      imgdata: imgeData,
      // filename: config.build.assetsSubDirectory + '/html/' + project + '/index.html',
      
      filename: config.build.assetsSubDirectory + 'index.html'+"?r="+Math.random(),
      template: config.projectConfig.project[project] + '/index.html' ,
      // template: './src/index.html' ,
      inject: true, //true | 'head' | 'body' |
      // favico: '',//将给定的图标路径添加到输出html。
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 生成html的时候只需要引入项目js代码[project]，公共js代码[vendor]即可，不需要再引入资源文件mainfest了
      chunks: function(project) {
        let chunks = [
          project,
          'manifest',
          'vendor',
        ];
        if (env.NODE_ENV !== config.build.name) {
          // 当环境不为production线上时
          // 额外注入热加载代码
          // 以实现文件的实时更新
          // add hot-reload related code to entry chunks
          chunks.push('./build/dev-client')
        }
        return chunks;
      }(project),
      chunksSortMode: 'dependency', // 按照依赖关系注入script标签，否则【一定】会造成代码无法运行！
    }
    template_list.push(
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin(html_template_config)
    )
  }
  return template_list;
}