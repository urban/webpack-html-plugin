import test from 'tape'

import fs from 'fs'
import {join} from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from '../'
import rimraf from 'rimraf'
import promisify from '@urban/promisify'

const outputDir = join(__dirname, './tmp/')
const pathTo = join.bind(null, outputDir)
const clear = promisify(rimraf.bind(null, outputDir))

const build = promisify(webpack)
const read = promisify(fs.readFile)
const exists = promisify(fs.stat, function (err, result) {
  this.resolve(err === null)
})

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

function customTemplate (data) {
  return `<!DOCTYPE html>
    <head>
       <title>${data.title}</title>
       <link rel="stylesheet" href="${data.css}"/>
    </head>
    <body>
      <div id="content">
       ${data.html}
      </div>
      <script src="${data.main}"></script>
    </body>
  </html>`
}

test('It work.', async assert => {
  assert.plan(3)
  try {
    const stats = await build(Object.assign({}, config, {
      plugins: [
        ...config.plugins,
        new HtmlPlugin()
      ]
    }))
    assert.pass('No fatal error.')
    assert.equal(stats.hasErrors(), false, 'No webpack errors.')
    assert.equal(stats.hasWarnings(), false, 'No webpack warnings.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})

test('It generates a default index.html.', async assert => {
  assert.plan(2)
  try {
    await build(Object.assign({}, config, {
      plugins: [
        ...config.plugins,
        new HtmlPlugin()
      ]
    }))
    const html = (await read(pathTo('index.html'))).toString()
    const sourceRegExp = /<script src="main.js"><\/script>/
    assert.equal(html.match(sourceRegExp).length, 1, 'Has one JavaScript source.')
    const styleRegExp = /<link rel="stylesheet" href="main.css"\/>/
    assert.equal(html.match(styleRegExp).length, 1, 'Has one CSS stylesheet.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})

test('It allows custom HTML filename.', async assert => {
  assert.plan(1)
  try {
    await build(Object.assign({}, config, {
      plugins: [
        ...config.plugins,
        new HtmlPlugin(function (assets, defaultTemplate, compiler) {
          return { 'test.html': defaultTemplate(assets) }
        })
      ]
    }))
    assert.equal(await exists(pathTo('test.html')), true, 'Custom file exists.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})

test('It allows custom HTML template.', async assert => {
  assert.plan(1)
  try {
    await build(Object.assign({}, config, {
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
    const html = (await read(pathTo('index.html'))).toString()
    const contentRegExp = /<div id="content">[\s]*Hello World[\s]*<\/div>/
    assert.equal(html.match(contentRegExp).length, 1, 'Has custom content.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})

test('It allows async.', async assert => {
  assert.plan(1)
  try {
    await build(Object.assign({}, config, {
      plugins: [
        ...config.plugins,
        new HtmlPlugin(function (assets, defaultTemplate, compiler) {
          return new Promise(function (resolve, reject) {
            setTimeout(resolve, 250, { 'index.html': defaultTemplate(assets) })
          })
        })
      ]
    }))
    assert.equal(await exists(pathTo('index.html')), true, 'File exists.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})

test('It allows you to write multiple HTML files.', async assert => {
  assert.plan(2)
  try {
    const indexTitle = 'Index File'
    const testTitle = 'Test File'
    await build(Object.assign({}, config, {
      plugins: [
        ...config.plugins,
        new HtmlPlugin(function (assets, defaultTemplate, compiler) {
          const indexData = Object.assign({}, assets, { title: indexTitle })
          const testData = Object.assign({}, assets, { title: testTitle })
          return {
            'index.html': defaultTemplate(indexData),
            'test.html': defaultTemplate(testData)
          }
        })
      ]
    }))
    const titleRegExp = /<title>(.*?)<\/title>/
    const indexHtml = (await read(pathTo('index.html'))).toString()
    assert.equal(indexHtml.match(titleRegExp)[1], indexTitle, 'File one has the correct content.')
    const testHtml = (await read(pathTo('test.html'))).toString()
    assert.equal(testHtml.match(titleRegExp)[1], testTitle, 'File two has the correct content.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  assert.end()
})
