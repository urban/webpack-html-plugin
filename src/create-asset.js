/* @flow */
export default function createAsset (asset: string) : { source: Function, size: Function } {
  return {
    source () {
      return asset
    },
    size () {
      return asset.length
    }
  }
}
