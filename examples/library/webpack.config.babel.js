import webpack from 'webpack'
import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin'

const env = process.env.NODE_ENV

const cssLoaders = env === 'production'
  ? extract('style', 'css?modules')
  : 'style!css?modules'

const compressor = {
  pure_getters: true,
  unsafe: true,
  unsafe_comps: true,
  screw_ie8: true,
  warnings: false
}

const config = {
  output: {
    library: 'HelloWorld',
    libraryTarget: 'umd'
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: cssLoaders },
      { test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'url?limit=10000' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new ExtractTextPlugin('[name].css'),
    // minimize in production
    ...(env === 'production'
      ? [ new webpack.optimize.UglifyJsPlugin({ compressor }) ]
      : [])
  ]
}

export default config
