import React from 'react'
import ReactDOM from 'react-dom'
import EpicsMetrics from './EpicsMetrics.jsx'
import { act } from 'react-dom/test-utils'

describe('EpicsMetrics component', () => {
    let div = null
    beforeEach(() => {
      div = document.createElement('div')
      document.body.appendChild(div)
    })
  
    afterEach(() => {
      ReactDOM.unmountComponentAtNode(div)
      div.remove()
      div = null
    })
  
    it('renders without crashing', () => {
      ReactDOM.render(<EpicsMetrics />, div)
    })
})