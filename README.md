# webpack-html-plugin

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A [webpack](https://webpack.github.io) plugin that renders HTML files at build time. Fantastic for "static" websites that don't require a Node server.


## Install

```sh
npm i --save @urban/webpack-html-plugin
```


## Usage

Below is a very basic example that renders one `index.html` file. You can find more example on using custom templates, waiting on asynchronous event to render and "universal" React in the different `webpack.config.babel.js` files within the [examples directory](examples).

```js
// webpack.config.babel.js

import HtmlPlugin from '@urban/webpack-html-plugin'

export default {
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: 'public'
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        loaders: ['babel']
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      }
    ]
  },
  plugins: [
    // generates an `index.html` by default
    new HtmlPlugin()
  ]
}
```

```js
// src/index.js

import styles from './styles.css'

const html = `<div class="${styles.container}">
    <h1 class="${styles.headline}">Hello World!</h1>
  </div>`

if (typeof document !== 'undefined') {
  document.body.innerHTML = html + document.body.innerHTML
}

export default html
```


## Examples

- [default](examples/default)
- [custom-template](examples/custom-template)
- [asynchronous](examples/asynchronous)
- [universal-react](examples/universal-react)


## License

[The MIT License (MIT)](LICENSE). Copyright (c) [Urban Faubion](http://urbanfaubion.com).
