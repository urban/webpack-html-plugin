# Universal React Example

...

```js
// webpack.config.js

new HtmlPlugin(function (assets, defaultTemplate, compiler) {

  var evaluate = require('eval')
  var React = require('react')

  var source = compiler.assets['bundle.js'].source()
  var App = evaluate(source, /* filename: */ undefined, /* scope: */ undefined, /* includeGlovals: */ true )

  var templateData = Object.assign({}, assets, {
      title: 'Universal React Example',
      html: '<div id="react-root">' + React.renderToString(React.createElement(App)) + '</div>'
    })

  return {
    'index.html': defaultTemplate(templateData)
  }

})
```
