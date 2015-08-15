export default function defaultHtml (stats, assets, defaultTemplate) {
  return { 'index.html': defaultTemplate(assets) }
}
