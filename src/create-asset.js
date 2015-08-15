export default function createAsset (asset) {
  return {
    source () {
      return asset
    },
    size () {
      return asset.length
    }
  }
}
