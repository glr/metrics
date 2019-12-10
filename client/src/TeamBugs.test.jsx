import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import { act } from 'react-dom/test-utils'
import TeamBugs from './TeamBugs.jsx'

jest.mock('./components/components.jsx', () => 
  ({
    WatermarkLineChart: () => <div data-testid="TestWatermarkLineChart">TestWatermarkLineChart</div>
  })
)

describe('TeamBugs component', () => {
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
      render(<TeamBugs />, div)
    })
  })

  it('renders a WatermarkLineChart', () => {
    act(() => {
      render(<TeamBugs />, div)
    })
    expect(div.querySelector('[data-testid="TestWatermarkLineChart"]').textContent).toEqual("TestWatermarkLineChart")
  })
})
