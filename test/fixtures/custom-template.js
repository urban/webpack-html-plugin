export default function customTemplate (assets) {
  var data = Object.assign({
    charset: 'utf-8',
    title: 'Custom Template',
    html: ''
  }, assets)

  return [
    '<!DOCTYPE html>',
    '<head>',
    ' <title>' + data.title + '</title>',
    ' <link rel="stylesheet" href="' + data.css + '"/>',
    '</head>',
    '<body>',
    ' <div id="content">',
    '   ' + data.html,
    ' </div>',
    ' <script src="' + data.main + '"></script>',
    '</body>'
  ].join('')
}
