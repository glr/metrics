import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import SLMetrics from './SLMetrics.jsx'
import { act } from 'react-dom/test-utils'

jest.mock("./TeamBugs.jsx", () => 
  () => <div data-testid="TestTeamBugs">
      TestTeamBugs
    </div>
)

jest.mock("./TeamMetrics.jsx", () => 
  () => {
    return(<div data-testid="TestTeamMetrics">
      TestTeamMetrics
    </div>)
  }
)

describe('SLMetrics component', () => {
  let div = null
  beforeEach(() => {
    const mockSuccessfulResponse = [{id:1,name:"test1"},{id:2,name:"test2"}]
    fetch.mockResponseOnce(JSON.stringify(mockSuccessfulResponse))
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    div.remove()
    div = null
    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    act(() => {
      render(<SLMetrics />, div)
    })
  })

  it('renders the TeamMetrics Component', async () => {
    await act(async () => {
      render(<SLMetrics />, div)
    })
    expect(div.querySelector('div[data-testid="TestTeamMetrics"]').textContent).toEqual("TestTeamMetrics")
  })
  
  it('renders the TeamBugs Component', async () => {
    await act(async () => {
      render(<SLMetrics />, div)
    })
    expect(div.querySelector('[data-testid="TestTeamBugs"]').textContent).toEqual("TestTeamBugs")
  })
})
