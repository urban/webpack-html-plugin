import styles from './styles.css'
import React, { Component } from 'react'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = { count: 0 }
  }

  render () {
    console.log(this.handleClick)
    return (
      <div className={styles.container}>
        <h1 className={styles.headline}>Hello Universal React!</h1>
        <h2>Clicked {this.state.count}</h2>
        <button onClick={this.handleClick}>click me!</button>
      </div>
    )
  }

  handleClick = (event) => {
    event.preventDefault()
    this.setState({ count: this.state.count + 1 })
  }

}

if (typeof document !== 'undefined') {
  React.render(<App />, document.querySelector('#react-root'))
}

export default App
