'use strict'

require('babel/polyfill')

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
    new HtmlPlugin(function (stats, assets, defaultTemplate) {

      return new Promise(function (resolve, reject) {
        var templateData = Object.assign({}, assets, {
          title: 'Asynchronous Example',
          html: '<div>Asynchronous!</div>'
        })

        setTimeout(resolve, 5 * 1000, {
          'index.html': defaultTemplate(templateData)
        })
      })

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
