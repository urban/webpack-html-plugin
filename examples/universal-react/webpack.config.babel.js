import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin'
import { HotModuleReplacementPlugin } from 'webpack'
import HtmlPlugin from '../../src'
import evaluate from 'eval'
import React from 'react'
import DomServer from 'react-dom/server'

const isDev = process.argv.some(arg => /webpack-dev-server$/.test(arg))

export default {
  context: __dirname,
  entry: [
    './src/index.jsx',
    ...(isDev ? ['webpack/hot/dev-server'] : [])
  ],
  output: {
    filename: '[name].js',
    path: './public/',
    // You must compile to UMD or CommonJS to require it in Node context.
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        loaders: ['babel']
      },
      {
        test: /\.css$/,
        loader: (isDev ? 'style!css?modules' : extract('style', 'css?modules'))
      }
    ]
  },
  plugins: [
    ...(isDev
      ? [new HotModuleReplacementPlugin()]
      : [new ExtractTextPlugin('[name].css')]
    ),
    new HtmlPlugin((assets, defaultTemplate, compiler) => {
      return new Promise((resolve, reject) => {
        const source = compiler.assets['main.js'].source()
        let App = evaluate(source, true)
        if ('__esModule' in App) {
          App = App['default']
        }
        const html = DomServer.renderToString(React.createElement(App))
        const templateData = {
          ...assets,
          title: 'Universal React Example',
          html: `<div id="react-root">${html}</div>`
        }
        resolve({'index.html': defaultTemplate(templateData)})
      })
      .catch(console.log)
    })
  ]
}
