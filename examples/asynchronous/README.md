# Asynchronous Example

...

```js
// webpack.config.babel.js

new HtmlPlugin((assets, defaultTemplate, compiler) => {
  return new Promise((resolve, reject) => {
    var templateData = Object.assign({}, assets, {
      title: 'Asynchronous Example'
    })
    setTimeout(resolve, 5 * 1000, {
      'index.html': defaultTemplate(templateData)
    })
  })
})
```
