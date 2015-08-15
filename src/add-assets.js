import createAsset from './create-asset'

export default function addAssets (filename, compiler, data) {
  if (isMissingDataType(data)) {
    errorForMissingDataType()
  }

  const dataType = typeof data
  var pages

  // if it's a string, we assume it's an html
  // string for the index file
  if (dataType === 'string') {
    pages = {}
    pages[filename] = data
  } else if (dataType === 'object') {
    pages = data
  } else {
    return errorForMissingDataType()
  }

  for (var name in pages) {
    compiler.assets[name] = createAsset(pages[name])
  }
}


function isMissingDataType (data) {
  const dataType = typeof data
  return !(dataType === 'string' || dataType === 'object')
}

function errorForMissingDataType () {
  throw new Error('HTMLPlugin: Result for `html` callback must be a string or an object.')
}
