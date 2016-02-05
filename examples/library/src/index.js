import React, { PropTypes } from 'react'

const HelloWorld = ({ name, ...otherProps }) => (
  <h1 {...otherProps}>Hello {name}!</h1>
)

HelloWorld.propTypes = {
  name: PropTypes.string
}

HelloWorld.defaultProps = {
  name: 'World'
}

export default HelloWorld
