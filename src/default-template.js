/* @flow */
export default function defaultTemplate (templateData: Object): string {
  const data = { charset: 'utf-8', html: '', ...templateData }
  const title = data.title ? `<title>${data.title}</title>` : ''
  const css = data.css ? `<link rel="stylesheet" href="${data.css}"/>` : ''

  return (`<!doctype html>
<html>
<head>
  <meta name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no" />
  ${title}
  ${css}
</head>
<body>
  ${data.html}
  <script src="${data.main}"></script>
</body>
</html>`)
}
