/* @flow */
export default function defaultHtml (assets: {}, defaultTemplate: Function): {} {
  return { 'index.html': defaultTemplate(assets) }
}
