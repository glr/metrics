import React from 'react'
import {StackedBarChart} from './components/components.jsx'

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
          <a href="https://sparefoot.atlassian.net/secure/RapidBoard.jspa?rapidView=270" target="_blank" >Epics In Progress - Big Rocks vs. non-Big Rocks</a>
          <StackedBarChart showBarValues={this.props.showBarValues} data={this.state.wipBars} yLabel={"Percent (by count)"} xLabel="Date" xTicks={this.state.dates} chart={"EpicWIPBars"} hoverPrec={2} additionalHoverText={"%"} />
          <p />
          <StackedBarChart showBarValues={this.props.showBarValues} data={this.state.wipCountBars} yLabel={"Epics"} xLabel="Date" xTicks={this.state.dates} chart={"EpicWIPCountBars"} />
        </div>
      )
    }
  }

 export default EpicsMetrics