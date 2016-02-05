import React from 'react'
import Dom from 'react-dom'

const App = () => (
  <div>
    <h1>Examples</h1>
    <ul>
      <li><a href='demo_1.html'>Demo 1</a></li>
      <li><a href='demo_2.html'>Demo 2</a></li>
      <li><a href='demo_3.html'>Demo 3</a></li>
    </ul>
  </div>
)

if (typeof document !== 'undefined') {
  Dom.render(
    React.createElement(App),
    document.getElementById('root')
  )
}
