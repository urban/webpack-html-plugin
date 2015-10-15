# Custom Template Example

An example showing how to render with a custom HTML template.

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
  return {'index.html': customTemplate(assets)}
})
```

```js
// webpack.config.babel.js

function customTemplate (assets) {
  const data = Object.assign({
    charset: 'utf-8',
    title: 'Custom Template',
    html: '',
    css: ''
  }, assets)

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
```


## License

This software is released into the public domain.
