import styles from './styles.css'
import React, { Component } from 'react'

class Hello extends Component {
  render () {
    return (
      <div className={styles.container}>
        <h1 className={styles.headline}>Hello Universal React!</h1>
      </div>
    )
  }
}

if (typeof document !== 'undefined') {
  React.render(<Hello />, document.querySelector('#react-root'))
}

export default Hello
