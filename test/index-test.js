import test from 'tape'
import fs from 'fs'
import { join } from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from '../src'
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
  output: {
    path: outputDir,
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules') }
    ]
  }
}

const getConfig = (entry, htmlPlugin) => ({
  ...config,
  entry,
  plugins: [
    ...config.plugins,
    ...htmlPlugin
  ]
})

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

test('It work.', async function (t) {
  t.plan(6)
  const htmlPlugin = new HtmlPlugin()
  try {
    const config = getConfig('./fixtures/index.js', [htmlPlugin])
    const stats = await build(config)
    t.pass('No fatal error.')
    t.equal(stats.hasErrors(), false, 'No webpack errors.')
    t.equal(stats.hasWarnings(), false, 'No webpack warnings.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  try {
    const config = getConfig('./fixtures/index-with-css.js', [htmlPlugin])
    const stats = await build(config)
    t.pass('No fatal error.')
    t.equal(stats.hasErrors(), false, 'With CSS, no webpack errors.')
    t.equal(stats.hasWarnings(), false, 'With CSS, no webpack warnings.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})

test('It generates a default index.html.', async function (t) {
  t.plan(3)
  const htmlPlugin = new HtmlPlugin()
  try {
    const config = getConfig('./fixtures/index.js', [htmlPlugin])
    await build(config)
    const html = (await read(pathTo('index.html'))).toString()
    const sourceRegExp = /<script src="main.js"><\/script>/
    t.equal(html.match(sourceRegExp).length, 1, 'Has one JavaScript source.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  try {
    const config = getConfig('./fixtures/index-with-css.js', [htmlPlugin])
    await build({
      ...config,
      output: {
        ...config.output,
        publicPath: 'dist'
      }
    })
    const html = (await read(pathTo('index.html'))).toString()
    const sourceRegExp = /<script src="dist\/main.js"><\/script>/
    t.equal(html.match(sourceRegExp).length, 1, 'Has one JavaScript source.')
    const styleRegExp = /<link rel="stylesheet" href="dist\/main.css"\/>/
    t.equal(html.match(styleRegExp).length, 1, 'Has one CSS stylesheet.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})

test('It allows custom HTML filename.', async function (t) {
  t.plan(1)
  const htmlPlugin = new HtmlPlugin((assets, defaultTemplate) => {
    return { 'test.html': defaultTemplate(assets) }
  })
  try {
    const config = getConfig('./fixtures/index.js', [htmlPlugin])
    await build(config)
    t.equal(await exists(pathTo('test.html')), true, 'Custom file exists.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})

test('It allows custom HTML template.', async function (t) {
  t.plan(1)
  const htmlPlugin = new HtmlPlugin((assets, defaultTemplate) => {
    const templateData = {
      ...assets,
      title: 'Custom Template',
      html: 'Hello World'
    }
    return { 'index.html': customTemplate(templateData) }
  })
  try {
    const config = getConfig('./fixtures/index.js', [htmlPlugin])
    await build(config)
    const html = (await read(pathTo('index.html'))).toString()
    const contentRegExp = /<div id="content">[\s]*Hello World[\s]*<\/div>/
    t.equal(html.match(contentRegExp).length, 1, 'Has custom content.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})

test('It allows async.', async function (t) {
  t.plan(1)
  const htmlPlugin = new HtmlPlugin((assets, defaultTemplate) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 250, { 'index.html': defaultTemplate(assets) })
    })
  })
  try {
    const config = getConfig('./fixtures/index.js', [htmlPlugin])
    await build(config)
    t.equal(await exists(pathTo('index.html')), true, 'File exists.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})

test('It allows you to write multiple HTML files.', async function (t) {
  t.plan(2)
  const indexTitle = 'Index File'
  const testTitle = 'Test File'
  const htmlPlugin = new HtmlPlugin((assets, defaultTemplate) => {
    const indexData = { ...assets, title: indexTitle }
    const testData = { ...assets, title: testTitle }
    return {
      'index.html': defaultTemplate(indexData),
      'test.html': defaultTemplate(testData)
    }
  })
  try {
    await build(getConfig('./fixtures/index.js', [htmlPlugin]))
    const titleRegExp = /<title>(.*?)<\/title>/
    const indexHtml = (await read(pathTo('index.html'))).toString()
    t.equal(
      indexHtml.match(titleRegExp)[1],
      indexTitle,
      'File one has the correct content.')
    const testHtml = (await read(pathTo('test.html'))).toString()
    t.equal(
      testHtml.match(titleRegExp)[1],
      testTitle,
      'File two has the correct content.')
  } catch (err) {
    console.log(err)
  }
  await clear()
  t.end()
})
