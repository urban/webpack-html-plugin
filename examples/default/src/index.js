import styles from './styles.css'

const html = `
  <div class="${styles.container}">
    <h1 class="${styles.headline}">Hello World!</h1>
  </div>
  `

document.body.innerHTML = html + document.body.innerHTML

export default html
