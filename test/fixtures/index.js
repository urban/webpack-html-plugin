const html = `
  <div style="border: 1px solid #333">
    <h1 style="margin: 3rem">Hello World!</h1>
  </div>`

if (typeof document !== 'undefined') {
  document.body.innerHTML = html + document.body.innerHTML
}
export default html
