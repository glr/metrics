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
    const epicData = fetch('http://localhost:3000/api/v1/metrics/epics')
    .then(results => {
      return results.json()
    })
    .then(data => {
      const wip = data.wip
      const todo = data.todo
      const dates = data.dates
      const legend = ["Big Rocks", "Other"]
      const epicCharts = (
        <div>
          Big Rocks vs. non-Big Rocks - In Progress
          <Component.StackedDualLineChart lineA={wip.bigRocks} lineB={wip.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - In Progress" chart="epicWIP" />
          <p />
          <Component.DualLineChart lineA={wip.bigRocks} lineB={wip.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - In Progress" chart="epicWIP" />
          <p />
          Big Rocks vs. non-Big Rocks - To Do
          <Component.StackedDualLineChart lineA={todo.bigRocks} lineB={todo.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - To Do" chart="epicTodo" />
          <p />
          <Component.DualLineChart lineA={todo.bigRocks} lineB={todo.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - To Do" chart="epicTodo" />
        </div>
      )
      this.setState({
        epicCharts: epicCharts
      })
    })
  }

  render() {
    return(
      <div>
        {this.state.epicCharts}
      </div>
    )
  }
}

class TeamMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const team = this.props.team
    const teamMetrics = fetch('http://localhost:3000/api/v1/metrics/' + team)
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
          story: d.story_pct * 100,
          bug: d.bug_pct * 100,
          spike: d.spike_pct * 100,
          techDebt: d.technical_debt_pct * 100,
          incident: d.incident_pct * 100,
          opWork: d.operational_work_pct * 100,
          dataFix: d.data_fix_pct * 100,
        })
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
        teamMetrics:(
          <div>
            <hr />
            <Component.TeamHeader data={headerMetrics} />
            <p />
            <Component.TrendLineChart data={metricData.forecastError} xLabel="Sprint" yLabel="Forecast Error %" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ForecastErrorLineChart"} />
            <p />
            <Component.TrendLineChart data={metricData.scopeChange} xLabel="Sprint" yLabel="Scope Change %" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ScopeChangeLineChart"} />
            <p />
            <Component.StackedBarChart data={metricData.typeCounts} xLabel="Sprint" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "IssueTypeBarChart"} />
            <hr />
          </div>
        )
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.teamMetrics}
      </div>
    )
  }
}

class SLMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state={}
  }

  componentDidMount() {
    const teams = fetch('http://localhost:3000/api/v1/teams')
    .then(results => {
      return results.json()
    })
    .then(data => {
      const teamMetrics = data.map((d, key) => {
        return(
          <div key={key}>
            <TeamMetrics team={d.id} teamName={d.name} />
          </div>
        )
      })
      this.setState({teamMetrics: teamMetrics})
    })
  }

  render () {
    return(<div>
      {this.state.teamMetrics}
    </div>)
  }
}

class T3Metrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // const teams = fetch('http://localhost:3000/api/v1/teams')
    // .then(results => {
    //   return results.json()
    // })
    // .then(data => {
    //   const teamMetrics = data.map((d, key) => {
    //     return(
    //       <div key={key}>
    //         <TeamMetrics team={d.id} teamName={d.name} />
    //       </div>
    //     )
    //   })
    //   this.setState({teamMetrics: teamMetrics})
    // })
  }

  render () {
    return(<div>
      {this.state.t3Metrics}
    </div>)
  }
}

function App() {
  return (
    <div className="App">
      <SLMetrics />
      <hr />
      <EpicsMetrics />
      <hr />
      <T3Metrics />
    </div>
  )  
}

export default App
