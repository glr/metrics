import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {TeamHeader} from './TeamHeader.jsx'
import { act } from 'react-dom/test-utils'

describe('TeamHeader component', () => {
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
      render(<TeamHeader />, div)
    })
  })
})
