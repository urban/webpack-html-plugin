# Universal React Example

An example showing how to load and evaluate the bundle for "universal" JavaScript rendering.


## Commands

```sh
$ npm install
$ npm run dev
$ npm run build
```


## Code

```js
// webpack.config.babel.js

import HtmlPlugin from '@urban/webpack-html-plugin'
import evaluate from 'eval'
import {createElement} from 'react'
import {renderToString} from 'react-dom/server'

```

```js
// webpack.config.babel.js

new HtmlPlugin((assets, defaultTemplate, compiler) => {
  return new Promise((resolve, reject) => {
    const source = compiler.assets['main.js'].source()
    const App = evaluate(source, undefined, undefined, true)
    const html = renderToString(createElement(App, null))
    const templateData = {
      ...assets,
      title: 'Universal React Example',
      html: `<div id="react-root">${html}</div>`
    }
    resolve({'index.html': defaultTemplate(templateData)})
  })
  .catch(console.log)
})
```


## License

This software is released into the public domain.
