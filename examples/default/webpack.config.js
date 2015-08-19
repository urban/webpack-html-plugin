'use strict'

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
