import defaultHtml from './default-html'
import defaultTemplate from './default-template'
import getAssets from './get-assets'
import createAsset from './create-asset'

export default class HTMLPlugin {

  constructor (htmlFunction) {
    this.htmlFunction = htmlFunction || defaultHtml
  }

  apply (compiler) {
    const htmlFunction = this.htmlFunction

    compiler.plugin('emit', function (currentCompiler, compilerCallback) {
      new Promise(function (resolve, reject) {
        const stats = currentCompiler.getStats().toJson()
        const publicPath = currentCompiler.options.output.publicPath
        const assets = getAssets(stats, publicPath)
        resolve([stats, assets])
      })
      .then(function (result) {
        const [stats, assets] = result
        return htmlFunction(stats, assets, defaultTemplate)
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
