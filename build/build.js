'use strict'

require('./check-versions')()
const config = require('../config')
// 进行环境赋值
process.env.NODE_ENV = config.build.name

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

// rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
rm(path.join(config.build.assetsRoot), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    if(process.env.upload){
      // console.log(process.env.project, '加载', process.env.bucketServers);
      
      const oss = require('../bin/oss')
    }
  })
})
