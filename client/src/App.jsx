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
      const wipBars = data.wipBars
      const todoBars = data.todoBars
      const epicCharts = (
        <div>
          Big Rocks vs. non-Big Rocks - In Progress
          <Component.StackedDualLineChart lineA={wip.bigRocks} lineB={wip.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - In Progress" chart="epicWIP" />
          <p />
          <Component.DualLineChart lineA={wip.bigRocks} lineB={wip.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - In Progress" chart="epicWIP" />
          <p />
          <Component.StackedBarChart data={wipBars} xLabel="Date" xTicks={dates} chart={"EpicWIPBars"} />
          <hr />
          Big Rocks vs. non-Big Rocks - To Do
          <Component.StackedDualLineChart lineA={todo.bigRocks} lineB={todo.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - To Do" chart="epicTodo" />
          <p />
          <Component.DualLineChart lineA={todo.bigRocks} lineB={todo.other} legend={legend} xTicks={dates} xLabel="Date" yLabel="Number of Epics" title="Big Rocks vs. non-Big Rocks - To Do" chart="epicTodo" />
          <p />
          <Component.StackedBarChart data={todoBars} xLabel="Date" xTicks={dates} chart={"EpicTodoBars"} />
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
          "Story": d.story_pct * 100,
          "Bug": d.bug_pct * 100,
          "Spike": d.spike_pct * 100,
          "Tech Debt": d.technical_debt_pct * 100,
          "Incident": d.incident_pct * 100,
          "Operational Work": d.operational_work_pct * 100,
          "Data Fix": d.data_fix_pct * 100,
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
    const t3metrics = fetch('http://localhost:3000/api/v1/metrics/t3')
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
      const t3 = data.map((d, key) => {
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
      })
      this.setState({t3Metrics: 
        <div>
          Tier 3 - Work Distribution
          <Component.StackedBarChart data={metricData.typeCounts} xLabel="Report Date" xTicks={metricData.dates} chart="T3IssueTypeBarChart" />
        </div>
      })
    })
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
      <T3Metrics />
      <hr />
      <EpicsMetrics />
    </div>
  )  
}

export default App
