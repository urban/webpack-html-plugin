import styles from './styles.css'

const html = `
  <div class="${styles.container}">
    <h1 class="${styles.headline}">Hello Custom Template!</h1>
  </div>
  `

if (typeof document !== 'undefined') {
  document.body.innerHTML = html + document.body.innerHTML
}

export default html
