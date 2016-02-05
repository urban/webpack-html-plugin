import React from 'react'
import Dom from 'react-dom'
import HelloWorld from '../../src'

const App = () => (
  <div>
    <HelloWorld style={{color: 'blue'}} />
  </div>
)

if (typeof document !== 'undefined') {
  Dom.render(
    React.createElement(App),
    document.getElementById('root')
  )
}
