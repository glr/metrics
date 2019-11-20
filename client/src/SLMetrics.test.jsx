import React from 'react'
import ReactDOM from 'react-dom'
import SLMetrics from './SLMetrics.jsx'
import { act } from 'react-dom/test-utils'

describe('SLMetrics component', () => {
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
      ReactDOM.render(<SLMetrics />, div)
    })
})