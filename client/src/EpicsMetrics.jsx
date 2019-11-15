import React from 'react'
import * as Component from './components/components.jsx'

class EpicsMetrics extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
  
    componentDidMount() {
      fetch('http://localhost:3000/api/v1/metrics/epics')
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.setState({
          dates: data.dates,
          wipBars: data.wipBars,
          wipCountBars: data.wipCountBars
        })
      })
    }
  
    render() {
      return(
        <div>
          Big Rocks vs. non-Big Rocks - In Progress
          <Component.StackedBarChart showBarValues={this.props.showBarValues} data={this.state.wipBars} yLabel={"Percent"} xLabel="Date" xTicks={this.state.dates} chart={"EpicWIPBars"} hoverPrec={2} additionalHoverText={"%"} />
          <p />
          <Component.StackedBarChart showBarValues={this.props.showBarValues} data={this.state.wipCountBars} yLabel={"Epics"} xLabel="Date" xTicks={this.state.dates} chart={"EpicWIPCountBars"} />
        </div>
      )
    }
  }

 export default EpicsMetrics