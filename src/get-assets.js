export default function getAssets (stats, publicPath = '') {
  const assets = {}
  var chunk
  var value

  for (chunk in stats.assetsByChunkName) {
    value = stats.assetsByChunkName[chunk]

    // webpack outputs an array for each chunk when using sorucemaps
    if (Array.isArray(value)) {
      // if we've got a CSS file add it here
      if (chunk === 'main' && value.length === 2) {
        assets.css = publicPath + value[1]
      }

      // The main bundle seems to always be the first element.
      value = publicPath + value[0]
    }
    assets[chunk] = value
  }

  return assets
}
