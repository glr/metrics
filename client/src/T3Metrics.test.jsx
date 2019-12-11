import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import T3Metrics from './T3Metrics.jsx'
import { act } from 'react-dom/test-utils'

describe('T3Metrics component', () => {
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
      render(<T3Metrics />, div)
    })
  })
})
