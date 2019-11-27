import React from 'react'
import SLMetrics from './SLMetrics.jsx'
import EpicsMetrics from './EpicsMetrics.jsx'
import T3Metrics from './T3Metrics.jsx'
import './Metrics.css'

class Metrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showBarValues: false
    }
    this.toggleShowBarValues = this.toggleShowBarValues.bind(this)
  }

  toggleShowBarValues() {
    let oldState = this.state.showBarValues
    this.setState({
      showBarValues:!oldState
    })
  }

  render() {
    let text = this.state.showBarValues? "Hide" : "Show"
    return (
      <div className="Metrics">
        <button onClick={this.toggleShowBarValues}>{text} Bar Values</button>
        <SLMetrics showBarValues={this.state.showBarValues}/>
        <hr />
        <T3Metrics showBarValues={this.state.showBarValues}/>
        <hr />
        <EpicsMetrics showBarValues={this.state.showBarValues}/>
        <hr />
        <button onClick={this.toggleShowBarValues}>{text} Bar Values</button>
      </div>
    )
  }
}

export default Metrics
