export default function defaultHtml (assets, defaultTemplate) {
  return { 'index.html': defaultTemplate(assets) }
}
