/* @flow */
import defaultHtml from './default-html'
import defaultTemplate from './default-template'
import getAssets from './get-assets'
import createAsset from './create-asset'

export default class HTMLPlugin {

  htmlFunction: Function

  constructor (htmlFunction: Function = defaultHtml) {
    this.htmlFunction = htmlFunction
  }

  apply (compiler) {
    const htmlFunction = this.htmlFunction

    compiler.plugin('emit', function (currentCompiler, compilerCallback) {
      new Promise(function (resolve, reject) {
        const stats = currentCompiler.getStats().toJson()
        const publicPath = currentCompiler.options.output.publicPath
        const assets = getAssets(stats, publicPath)
        resolve(assets)
      })
      .then(function (assets) {
        return htmlFunction(assets, defaultTemplate, currentCompiler)
      })
      .then(function (pages) {
        for (let page in pages) {
          currentCompiler.assets[page] = createAsset(pages[page])
        }
      })
      .catch(console.error)
      .then(compilerCallback)
    })
  }
}
