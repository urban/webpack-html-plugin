'use strict'

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('@urban/webpack-html-plugin')

module.exports = {

  entry: __dirname + '/src/index.js',

  output: {
    path: 'public/',
    filename: 'bundle.js'
  },

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlPlugin()
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
