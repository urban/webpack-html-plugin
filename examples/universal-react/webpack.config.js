'use strict'

require('babel/polyfill')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('@urban/webpack-html-plugin')

module.exports = {

  entry: './src/index.jsx',

  output: {
    filename: 'bundle.js',
    path: 'public',
    // You must compile to UMD or CommonJS to require it in Node context.
    libraryTarget: 'umd'
  },

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlPlugin(function (assets, defaultTemplate, compiler) {

      var evaluate = require('eval')
      var React = require('react')

      var source = compiler.assets['bundle.js'].source()
      var App = evaluate(source, undefined, undefined, true)

      var templateData = Object.assign({}, assets, {
          title: 'Universal React Example',
          html: '<div id="react-root">' + React.renderToString(React.createElement(App)) + '</div>'
        })

      return {
        'index.html': defaultTemplate(templateData)
      }

    })
  ],

  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
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

