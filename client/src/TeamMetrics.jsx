import * as d3 from "d3"
import last from "lodash/last"
import React from 'react'
import {TrendLineChart, InverseTrendLineChart, StackedBarChart} from './components/components.jsx'
import {TeamHeader} from './TeamHeader.jsx'
import './TeamMetrics.css'

class TeamMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      headerMetrics: {
        teamName: this.props.teamName || "",
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
        attainment: [],
        typeCounts: []
      }
      data.map(d => {
        metricData.sprints.push(d.name)
        metricData.scopeChange.push(Math.abs(d.scope_change_pct * 100))
        metricData.forecastError.push(d.forecast_error_pct * 100)
        metricData.attainment.push(d.attainment * 100)
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
        attainment: metricData.attainment,
        sprints: metricData.sprints,
        scopeChange: metricData.scopeChange,
        typeCounts: metricData.typeCounts,
        headerMetrics: headerMetrics
      })
    })
  }

  render() {
    const teamName = this.props.teamName || ""
    return (
      <div className="teamMetrics">
        <div className="teamHeader">
          <TeamHeader data={this.state.headerMetrics} />
        </div>
        <div className="teamCharts" >
          <InverseTrendLineChart data={this.state.attainment} xLabel="Sprint" yLabel="Attainment %" xTicks={this.state.sprints} chart={teamName.replace(/\s/g, '') + "ForecastAttainmentLineChart"} />
          <p />
          <TrendLineChart data={this.state.forecastError} xLabel="Sprint" yLabel="Forecast Error %" xTicks={this.state.sprints} chart={teamName.replace(/\s/g, '') + "ForecastErrorLineChart"} />
          <p />
          <TrendLineChart data={this.state.scopeChange} xLabel="Sprint" yLabel="Mid-Sprint Pivot %" xTicks={this.state.sprints} chart={teamName.replace(/\s/g, '') + "ScopeChangeLineChart"} />
          <p />
          <StackedBarChart showBarValues={this.props.showBarValues} data={this.state.typeCounts} yLabel={"Percent (by count)"} xLabel="Sprint" xTicks={this.state.sprints} chart={teamName.replace(/\s/g, '') + "IssueTypeBarChart"} hoverPrec={2} additionalHoverText={"%"} />
        </div>
      </div>
    )
  }
}

export default TeamMetrics