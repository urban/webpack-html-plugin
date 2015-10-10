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
    compiler.plugin('emit', (currentCompiler, compilerCallback) => {
      new Promise((resolve, reject) => {
        const stats = currentCompiler.getStats().toJson()
        const publicPath = currentCompiler.options.output.publicPath
        const assets = getAssets(stats, publicPath)
        resolve(assets)
      })
      .then(assets => this.htmlFunction(assets, defaultTemplate, currentCompiler))
      .then(pages => {
        for (let key in pages) {
          currentCompiler.assets[key] = createAsset(pages[key])
        }
      })
      .then(compilerCallback)
      .catch(console.error)
    })
  }
}
