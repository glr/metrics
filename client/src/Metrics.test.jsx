import React from 'react'
import ReactDOM from 'react-dom'
import Metrics from './Metrics.jsx'
import { act } from 'react-dom/test-utils'

jest.mock("./SLMetrics.jsx", () => {
  return function MockedSLMetrics(props) {
    return (
      <div data-testid="SLMetrics">
        TestSLMetrics
      </div>
    )
  }
})

jest.mock("./T3Metrics.jsx", () => {
  return function MockedT3Metrics(props) {
    return (
      <div data-testid="T3Metrics">
        TestT3Metrics
      </div>
    )
  }
})

jest.mock("./EpicsMetrics.jsx", () => {
  return function MockedEpicsMetrics(props) {
    return (
      <div data-testid="EpicsMetrics">
        TestEpicsMetrics
      </div>
    )
  }
})
describe('Metrics component', () => {
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
    ReactDOM.render(<Metrics />, div)
  })

  it('toggles whether or not to show the bar graph values', () => {
    const toggleShowBarValues = jest.spyOn(Metrics.prototype, 'toggleShowBarValues')
    act(() => {
      ReactDOM.render(<Metrics />, div)
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
      ReactDOM.render(<Metrics />, div)
    })
    expect(div.querySelector('[data-testid="SLMetrics"]').textContent).toEqual("TestSLMetrics")
  })

  it ('renders T3Metrics', () => {
    act(() => {
      ReactDOM.render(<Metrics />, div)
    })
    expect(div.querySelector('[data-testid="T3Metrics"]').textContent).toEqual("TestT3Metrics")
  })

  it ('renders EpicsMetrics', () => {
    act(() => {
      ReactDOM.render(<Metrics />, div)
    })
    expect(div.querySelector('[data-testid="EpicsMetrics"]').textContent).toEqual("TestEpicsMetrics")
  })
})
