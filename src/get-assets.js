/* @flow */

import { join, extname } from 'path'

const hasExtension = (ext, x) => ext === extname(x)

function getAssets (stats: Object, publicPath: string = ''): Object {
  const assets = {}
  const toPath = (x) => join(publicPath, x)

  for (let key in stats.assetsByChunkName) {
    let value = stats.assetsByChunkName[key]

    if (Array.isArray(value)) {
      const cssIndex = value.findIndex((x) => hasExtension('.css', x))
      const jsIndex = value.findIndex((x) => hasExtension('.js', x))
      if (cssIndex !== -1) {
        assets.css = toPath(value[cssIndex])
      }
      assets[key] = toPath(value[jsIndex])
      continue
    }
    assets[key] = toPath(value)
  }

  return assets
}

export default getAssets
