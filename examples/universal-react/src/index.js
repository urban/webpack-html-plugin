import React from 'react'
import Dom from 'react-dom'

const styles = {
  container: {
    border: '1px solid #333'
  },
  headline: {
    margin: '3rem'
  }
}

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
      <div style={styles.container}>
        <h1 style={styles.headline}>Hello Universal React!</h1>
        <h2>Clicked {this.state.count}</h2>
        <button onClick={this.handleClick.bind(this)}>click me!</button>
      </div>
    )
  }
}

if (typeof document !== 'undefined') {
  Dom.render(
    <App />,
    document.getElementById('root')
  )
}

export default App
