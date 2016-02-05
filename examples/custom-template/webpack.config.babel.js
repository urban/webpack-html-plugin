import ExtractTextPlugin, {extract} from 'extract-text-webpack-plugin'
import {HotModuleReplacementPlugin} from 'webpack'
import HtmlPlugin from '../../src'

const isDev = process.argv.some(arg => /webpack-dev-server$/.test(arg))

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
      { test: /\.js$/, loaders: ['babel'] },
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
      return {'index.html': customTemplate(assets)}
    })
  ]
}

function customTemplate (assets) {
  const data = {
    charset: 'utf-8',
    title: 'Custom Template',
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
  <div id="content">${data.html}</div>
  <script src="${data.main}"></script>
</body>`
}
