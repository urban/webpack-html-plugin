'use strict'

require('babel/polyfill')

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('@urban/webpack-html-plugin')

module.exports = {

  entry: path.join(__dirname, './src/index.jsx'),

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './public'),
    // You must compile to UMD or CommonJS to require it in Node context.
    libraryTarget: 'umd'
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: './public'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin('bundle.css'),
    new HtmlPlugin(function (assets, defaultTemplate, compiler) {
      return new Promise(function (resolve, reject) {
        var evaluate = require('eval')
        var React = require('react')

        var source = compiler.assets['bundle.js'].source()
        var App = evaluate(source, undefined, undefined, true)
        var html = React.renderToString(React.createElement(App))
        var templateData = Object.assign({}, assets, {
          title: 'Universal React Example',
          html: '<div id="react-root">' + html + '</div>'
        })

        resolve({
          'index.html': defaultTemplate(templateData)
        })
      })
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules')
      }
    ]
  }
}

