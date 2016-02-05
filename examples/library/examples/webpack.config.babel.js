import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import webpack, { HotModuleReplacementPlugin } from 'webpack'
import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin'
import HtmlPlugin from '../../../src'
import { keys, map, reduce } from 'ramda'

const env = process.env.NODE_ENV

const cssLoaders = env === 'production'
  ? extract('style-loader', 'css-loader?modules')
  : 'style-loader!css-loader?modules'

const customTemplate = (key, assets) => {
  const data = {
    charset: 'utf-8',
    title: 'Multiple Entries',
    html: '',
    css: '',
    ...assets
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.title}</title>
  <link rel="stylesheet" href="${data.css}"/>
</head>
<body>
  <div id="root">${data.html}</div>
  <script src="common.js"></script>
  <script src="${data[key]}"></script>
</body>
</hmtl>
`
}

const createTemplate = key => new HtmlPlugin((assets) => {
  return { [`${key}.html`]: customTemplate(key, assets) }
})

const isDirectory = x => statSync(join(__dirname, x)).isDirectory()
const makeEntry = x => ({ [x]: join(__dirname, x, 'index.js') })
const makeEntries = (acc, x) => (isDirectory(x)
  ? { ...acc, ...makeEntry(x) }
  : acc)

const config = {
  entry: reduce(
    makeEntries,
    { index: __dirname },
    readdirSync(__dirname)
  ),
  output: {
    filename: '[name].js',
    path: join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'hello-world': join(__dirname, '..', 'src')
    }
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.css$/, loader: cssLoaders },
      { test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'url-loader?limit=10000' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

const devConfig = {
  ...config,
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT
  },
  plugins: [
    ...config.plugins,
    new HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new ExtractTextPlugin('[name].css'),
    ...map(createTemplate, keys(config.entry))
  ]
}

export default devConfig
