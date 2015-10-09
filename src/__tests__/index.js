import test from 'tape'

import fs from 'fs'
import {join} from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from '../'
import rimraf from 'rimraf'

const outputDir = join(__dirname, '../dist/')
const outputFile = join.bind(null, outputDir)
const removeOutput = rimraf.bind(null, outputDir)

const config = {
  context: __dirname,
  entry: './fixtures/index.js',
  output: {
    path: outputDir,
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  plugins: [ new ExtractTextPlugin('[name].css') ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules') }
    ]
  }
}

function promisify (fn, context = {}) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      fn.apply(context, [...args, function (err, ...result) {
        if (err) return reject(err)
        resolve.apply(null, result)
      }])
    })
  }
}

const webpackPromise = promisify(webpack)
const readFilePromise = promisify(fs.readFile)

function customTemplate (data) {
  return `
<!DOCTYPE html>
<head>
   <title>${data.title}</title>
   <link rel="stylesheet" href="${data.css}"/>
</head>
<body>
  <div id="content">
   ${data.html}
  </div>
  <script src="${data.main}"></script>
</body>`
}

test('It work.', function (assert) {
  assert.plan(3)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin()
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    const jsonStats = stats.toJson()
    assert.equal(jsonStats.errors.length, 0, 'No webpack errors.')
    assert.equal(jsonStats.warnings.length, 0, 'No webpack warnings.')
    removeOutput(assert.end)
  })
  .catch(console.log)
})

test('It generates a default index.html.', function (assert) {
  assert.plan(4)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin()
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    return readFilePromise(outputFile('index.html'))
  })
  .then(function (data) {
    assert.pass('File exists.')
    const html = data.toString()
    const sourceRegExp = /<script src="main.js"><\/script>/
    assert.equal(html.match(sourceRegExp).length, 1, 'Has one JavaScript source.')
    const styleRegExp = /<link rel="stylesheet" href="main.css"\/>/
    assert.equal(html.match(styleRegExp).length, 1, 'Has one CSS stylesheet.')
    removeOutput(assert.end)
  })
  .catch(console.log)
})

test('It allows custom HTML filename.', function (assert) {
  assert.plan(2)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin(function (assets, defaultTemplate, compiler) {
        return { 'test.html': defaultTemplate(assets) }
      })
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    return readFilePromise(outputFile('test.html'))
  })
  .then(function (data) {
    assert.pass('File exists.')
    removeOutput(assert.end)
  })
  .catch(console.log)
})

test('It allows custom HTML template.', function (assert) {
  assert.plan(3)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin(function (assets, defaultTemplate, compiler) {
        const templateData = Object.assign({}, assets, {
          title: 'Custom Template',
          html: 'Hello World'
        })
        return { 'index.html': customTemplate(templateData) }
      })
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    return readFilePromise(outputFile('index.html'))
  })
  .then(function (data) {
    assert.pass('File exists.')
    const html = data.toString()
    const contentRegExp = /<div id="content">[\s]*Hello World[\s]*<\/div>/
    assert.equal(html.match(contentRegExp).length, 1, 'Has custom content.')
    removeOutput(assert.end)
  })
  .catch(console.log)
})

test('It allows async.', function (assert) {
  assert.plan(2)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin(function (assets, defaultTemplate, compiler) {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 250, { 'index.html': defaultTemplate(assets) })
        })
      })
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    return readFilePromise(outputFile('index.html'))
  })
  .then(function (data) {
    assert.pass('File exists.')
    removeOutput(assert.end)
  })
  .catch(console.log)
})

test('It allows you to write multiple HTML files.', function (assert) {
  assert.plan(3)
  webpackPromise(Object.assign({}, config, {
    plugins: [
      ...config.plugins,
      new HtmlPlugin(function (assets, defaultTemplate, compiler) {
        const indexData = Object.assign({}, assets, { title: 'Index File' })
        const testData = Object.assign({}, assets, { title: 'Test File' })
        return {
          'index.html': defaultTemplate(indexData),
          'test.html': defaultTemplate(testData)
        }
      })
    ]
  }))
  .then(function (stats) {
    assert.pass('No fatal error.')
    return Promise.all([
      readFilePromise(outputFile('index.html'))
        .then(function (data) {
          const html = data.toString()
          const titleRegExp = /<title>Index File<\/title>/
          assert.equal(html.match(titleRegExp).length, 1, 'File one has the right content.')
        }),
      readFilePromise(join(outputDir, 'test.html'))
        .then(function (data) {
          const html = data.toString()
          const titleRegExp = /<title>Test File<\/title>/
          assert.equal(html.match(titleRegExp).length, 1, 'File two has the right content.')
        })
    ])
  })
  .then(function () {
    removeOutput(assert.end)
  })
  .catch(console.log)
})
