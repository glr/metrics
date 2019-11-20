import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {TrendLineChart} from './components.jsx'
import { act } from 'react-dom/test-utils'

describe('TrendLineChart component', () => {
  let div = null
  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    div.remove()
    div = null
  })

  it('renders without crashing', () => {
    act(() => {
      render(<TrendLineChart />, div)
    })
  })
})
