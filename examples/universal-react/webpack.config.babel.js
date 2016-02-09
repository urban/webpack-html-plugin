import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin'
import { HotModuleReplacementPlugin } from 'webpack'
import HtmlPlugin from '../../src'
// import evaluate from 'eval'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './src'

const isDev = process.argv.some((arg) => /webpack-dev-server$/.test(arg))

const config = {
  context: __dirname,
  entry: [
    './src/index.js',
    ...(isDev ? ['webpack/hot/dev-server'] : [])
  ],
  output: {
    filename: '[name].js',
    path: './public/',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'] },
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
        const RootComponent = renderToString(React.createElement(App))
        const templateData = {
          ...assets,
          title: 'Universal React Example',
          html: `<div id="react-root">${RootComponent}</div>`
        }
        resolve({'index.html': customTemplate(templateData)})
      })
      .catch((err) => {
        compiler.errors.push(err)
      })
    })
  ]
}

function customTemplate (assets) {
  const data = {
    charset: 'utf-8',
    title: 'Universal React',
    html: '',
    css: '',
    ...assets
  }

  return `<!DOCTYPE html>
<head>
  <title>${data.title}</title>
  <link rel="stylesheet" href="${data.css}"/>
</head>
<body>
  <div id="root">${data.html}</div>
  <script src="${data.main}"></script>
</body>`
}

export default config
