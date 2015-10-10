import styles from './styles.css'
import React, {Component} from 'react'
import {render} from 'react-dom'

export default class App extends Component {

  constructor (props) {
    super(props)
    this.state = { count: 0 }
  }

  handleClick (event) {
    event.preventDefault()
    this.setState({ count: this.state.count + 1 })
  }

  render () {
    return <div className={styles.container}>
      <h1 className={styles.headline}>Hello Universal React!</h1>
      <h2>Clicked {this.state.count}</h2>
      <button onClick={this.handleClick.bind(this)}>click me!</button>
    </div>
  }
}

if (typeof document !== 'undefined') {
  render(<App />, document.querySelector('#react-root'))
}
