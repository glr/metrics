// import logo from './logo.svg'
import * as d3 from "d3"
import last from "lodash/last"
import React from 'react'
import * as Component from './components/components.jsx'
import './App.css'

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

class TeamMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      headerMetrics: {
        teamName: this.props.teamName,
        lastSprintName:"",
        lastSprintGoal: "",
        avgForecastError: 0,
        forecastStdDev: 0,
        avgScopeChange: 0,
        scopeChangeStdDev: 0,
      }
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/metrics/' + this.props.team)
    .then(results => {
      return results.json()
    })
    .then(data => {
      const lastSprint = last(data)
      const metricData = {
        sprints: [],
        scopeChange: [],
        forecastError: [],
        typeCounts: []
      }
      data.map(d => {
        metricData.sprints.push(d.name)
        metricData.scopeChange.push(d.scope_change_pct * 100)
        metricData.forecastError.push(d.forecast_error_pct * 100)
        metricData.typeCounts.push({
          "Story": d.story_pct * 100,
          "Bug": d.bug_pct * 100,
          "Spike": d.spike_pct * 100,
          "Tech Debt": d.technical_debt_pct * 100,
          "Incident": d.incident_pct * 100,
          "Operational Work": d.operational_work_pct * 100,
          "Data Fix": d.data_fix_pct * 100,
        })
        return true
      })
      const headerMetrics = {
        teamName: this.props.teamName,
        lastSprintName: lastSprint.name,
        lastSprintGoal: lastSprint.goal,
        avgForecastError: d3.mean(metricData.forecastError),
        forecastStdDev: d3.deviation(metricData.forecastError),
        avgScopeChange: d3.mean(metricData.scopeChange),
        scopeChangeStdDev: d3.deviation(metricData.scopeChange),
      }
      this.setState({
        forecastError: metricData.forecastError,
        sprints: metricData.sprints,
        scopeChange: metricData.scopeChange,
        typeCounts: metricData.typeCounts,
        headerMetrics: headerMetrics
      })
    })
  }

  render() {
    return (
      <div>
        <hr />
        <Component.TeamHeader data={this.state.headerMetrics} />
        <p />
        <Component.TrendLineChart data={this.state.forecastError} xLabel="Sprint" yLabel="Forecast Error %" xTicks={this.state.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ForecastErrorLineChart"} />
        <p />
        <Component.TrendLineChart data={this.state.scopeChange} xLabel="Sprint" yLabel="Scope Change %" xTicks={this.state.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ScopeChangeLineChart"} />
        <p />
        <Component.StackedBarChart showBarValues={this.props.showBarValues} data={this.state.typeCounts} yLabel={"Percent"} xLabel="Sprint" xTicks={this.state.sprints} chart={this.props.teamName.replace(/\s/g, '') + "IssueTypeBarChart"} hoverPrec={2} additionalHoverText={"%"} />
        <hr />
      </div>
    )
  }
}

class SLMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state={teamMetrics:[]}
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/teams')
    .then(results => {
      return results.json()
    })
    .then(data => {
      this.setState({teamMetrics: data})
    })
  }

  render () {
    return(this.state.teamMetrics.map((d, key) => {
        return (<div key={key}>
          <TeamMetrics showBarValues={this.props.showBarValues} team={d.id} teamName={d.name} />
        </div>)
    }))
  }
}

class T3Metrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/metrics/t3')
    .then(results => {
      return results.json()
    })
    .then(data => {
      // # Labels currently we care about:
      // const labels = [
      //   "Custom Dev",
      //   "Quote",
      //   "Split",
      //   "Merge",
      //   "Post Conversion",
      //   "SRE",
      //   "Data Fix",
      //   "CSL-1",
      //   "Documentation",
      //   "CC Merge",
      //   "Other"
      // ]

      const metricData = {
        dates: [],
        typeCounts: []
      }
      data.map((d, key) => {
        const total = 
          d.customDev +
          d.quote +
          d.split +
          d.merge +
          d.postConversion +
          d.sre +
          d.datafix +
          d.csl1 +
          d.documentation +
          d.ccMerge +
          d.other
        metricData.typeCounts.push({
          "Custom Dev": d.customDev/total * 100,
          "Quote": d.quote/total * 100,
          "Split": d.split/total * 100,
          "Merge": d.merge/total * 100,
          "Post Conversion": d.postConversion/total * 100,
          "SRE": d.sre/total * 100,
          "Data Fix": d.datafix/total * 100,
          "CSL-1": d.csl1/total * 100,
          "Documentation": d.documentation/total * 100,
          "CC Merge": d.ccMerge/total * 100,
          "Other": d.other/total * 100
        })
        metricData.dates.push(d.endDate)
        return true
      })
      this.setState({
        typeCounts: metricData.typeCounts,
        dates: metricData.dates
      })
    })
  }
  
  render () {
    return(
      <div>
        Tier 3 - Work Distribution
        <Component.StackedBarChart showBarValues={this.props.showBarValues} data={this.state.typeCounts} yLabel={"Percent"} xLabel="Report Date" xTicks={this.state.dates} chart="T3IssueTypeBarChart" hoverPrec={2} additionalHoverText={"%"} />
      </div>
    )
  }
}

class Metrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showBarValues: false
    }
    this.showHideBarValues = this.showHideBarValues.bind(this)
  }

  showHideBarValues() {
    let oldState = this.state.showBarValues
    this.setState({
      showBarValues:!oldState
    })
  }

  render() {
    let text = this.state.showBarValues? "Hide" : "Show"
    return (
      <div className="Metrics">
        <button onClick={this.showHideBarValues}>{text} Bar Values</button>
        <SLMetrics showBarValues={this.state.showBarValues}/>
        <hr />
        <T3Metrics showBarValues={this.state.showBarValues}/>
        <hr />
        <EpicsMetrics showBarValues={this.state.showBarValues}/>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Metrics />
    </div>
  )  
}

export default App
