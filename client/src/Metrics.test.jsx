import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import Metrics from './Metrics.jsx'
import { act } from 'react-dom/test-utils'

jest.mock("./SLMetrics.jsx", () => 
  () => 
    <div data-testid="SLMetrics">
      TestSLMetrics
    </div>
)

jest.mock("./EpicsMetrics.jsx", () => 
  () =>
    <div data-testid="EpicsMetrics">
      TestEpicsMetrics
    </div>
)

describe('Metrics component', () => {
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
      render(<Metrics />, div)
    })
  })

  it('toggles whether or not to show the bar graph values', () => {
    const toggleShowBarValues = jest.spyOn(Metrics.prototype, 'toggleShowBarValues')
    act(() => {
      render(<Metrics />, div)
    })
    
    const button = document.querySelector("button")
    expect(button.innerHTML).toBe("Show Bar Values")
    act(() => {
      button.dispatchEvent(new MouseEvent("click", {bubbles: true}))
    })
    expect(toggleShowBarValues).toHaveBeenCalledTimes(1)
    expect(button.innerHTML).toBe("Hide Bar Values")

    act(() => {
      for (let i = 0; i < 5; i++) {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      }
    })
    expect(toggleShowBarValues).toHaveBeenCalledTimes(6)
    expect(button.innerHTML).toBe("Show Bar Values")
  })

  it ('renders SLMetrics', () => {
    act(() => {
      render(<Metrics />, div)
    })
    expect(div.querySelector('[data-testid="SLMetrics"]').textContent).toEqual("TestSLMetrics")
  })

  it ('renders EpicsMetrics', () => {
    act(() => {
      render(<Metrics />, div)
    })
    expect(div.querySelector('[data-testid="EpicsMetrics"]').textContent).toEqual("TestEpicsMetrics")
  })
})
