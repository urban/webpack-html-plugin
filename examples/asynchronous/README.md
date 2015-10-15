# Asynchronous Example

An example showing how to delay rendering for asynchronous events.

## Commands

```sh
$ npm install
$ npm run dev
$ npm run build
```


## Code

```js
// webpack.config.babel.js

new HtmlPlugin((assets, defaultTemplate, compiler) => {
  return new Promise((resolve, reject) => {
    var templateData = {
      ...assets,
      title: 'Asynchronous Example'
    }
    setTimeout(resolve, 5 * 1000, {
      'index.html': defaultTemplate(templateData)
    })
  })
})
```


## License

This software is released into the public domain.
