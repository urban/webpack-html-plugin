import ExtractTextPlugin, {extract} from 'extract-text-webpack-plugin'
import {HotModuleReplacementPlugin} from 'webpack'
import HtmlPlugin from '../../src'

const isDev = process.argv.some((arg) => /webpack-dev-server$/.test(arg))

export default {
  context: __dirname,
  entry: [
    './src/index.js',
    ...(isDev ? ['webpack/hot/dev-server'] : [])
  ],
  output: {
    filename: '[name].js',
    path: './public/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'] },
      { test: /\.css$/, loader: (isDev
        ? 'style!css?modules'
        : extract('style', 'css?modules'))}
    ]
  },
  plugins: [
    ...(isDev
      ? [new HotModuleReplacementPlugin()]
      : [new ExtractTextPlugin('[name].css')]
    ),
    new HtmlPlugin((assets, defaultTemplate, compiler) => {
      return new Promise((resolve) => {
        var templateData = {
          title: 'Asynchronous Example',
          ...assets
        }
        setTimeout(resolve, 5 * 1000, {
          'index.html': defaultTemplate(templateData)
        })
      })
    })
  ]
}
