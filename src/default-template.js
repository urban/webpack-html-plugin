/* @flow */
export default function defaultTemplate (templateData: Object): string {
  const data = Object.assign({
    charset: 'utf-8',
    html: ''
  }, templateData)

  return (`
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    ${data.title ? `<title>${data.title}</title>` : ''}
    ${data.css ? `<link rel="stylesheet" href="${data.css}"/>` : ''}
  </head>
  <body>
    ${data.html}
    <script src="${data.main}"></script>
  </body>
</html>
    `)
}
