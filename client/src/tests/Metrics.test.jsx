import React from 'react'
import ReactDOM from 'react-dom'
import Metrics from '../Metrics.jsx'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Metrics />, div)
  ReactDOM.unmountComponentAtNode(div)
})
