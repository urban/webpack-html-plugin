'use strict'

require('babel/polyfill')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('@urban/webpack-html-plugin')

module.exports = {

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: 'public'
  },

  devServer: {
    contentBase: './public'
  },

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlPlugin(function (assets, defaultTemplate, compiler) {
      return {
        'index.html': customTemplate(assets)
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules')
      }
    ]
  }
}

function customTemplate (assets) {
  var data = Object.assign({
    charset: 'utf-8',
    title: 'Custom Template',
    html: ''
  }, assets)

  return [
    '<!DOCTYPE html>',
    '<head>',
    ' <title>' + data.title + '</title>',
    ' <link rel="stylesheet" href="' + data.css + '"/>',
    '</head>',
    '<body>',
    ' <div id="content">',
    '   ' + data.html,
    ' </div>',
    ' <script src="' + data.main + '"></script>',
    '</body>'
  ].join('')
}
