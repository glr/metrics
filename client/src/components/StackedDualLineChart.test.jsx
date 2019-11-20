import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {StackedDualLineChart} from './components.jsx'
import { act } from 'react-dom/test-utils'

describe('StackedDualLineChart component', () => {
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
      render(<StackedDualLineChart lineA={[]} lineB={[]} xTicks={[]} legend={[]} />, div)
    })
  })
})
