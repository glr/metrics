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
    const mockSuccessfulResponse = []
    fetch.mockResponseOnce(JSON.stringify(mockSuccessfulResponse))
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    div.remove()
    div = null
    fetch.resetMocks()
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
