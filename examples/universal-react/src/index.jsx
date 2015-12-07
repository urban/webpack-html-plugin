import React from 'react'
import Dom from 'react-dom'
import styles from './styles.css'

class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = { count: 0 }
  }

  handleClick (event) {
    event.preventDefault()
    this.setState({ count: this.state.count + 1 })
  }

  render () {
    return (
      <div className={styles.container}>
        <h1 className={styles.headline}>Hello Universal React!</h1>
        <h2>Clicked {this.state.count}</h2>
        <button onClick={this.handleClick.bind(this)}>click me!</button>
      </div>
    )
  }
}

if (typeof document !== 'undefined') {
  Dom.render(
    React.createElement(App),
    document.querySelector('#react-root')
  )
}

export default App
