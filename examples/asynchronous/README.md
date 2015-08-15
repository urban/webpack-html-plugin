# Asynchronous Example

...

```js
// webpack.config.js

new HtmlPlugin(function (stats, assets, defaultTemplate) {

  return new Promise(function (resolve, reject) {
    var templateData = Object.assign({}, assets, {
      title: 'Asynchronous HTML',
      html: '<div>Asynchronous!!</div>'
    })

    setTimeout(resolve, 5 * 1000, {
      'index.html': defaultTemplate(templateData)
    })
  })

})
```
