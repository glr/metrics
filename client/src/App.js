// import logo from './logo.svg';
import * as d3 from "d3";
import last from "lodash/last";
import React from 'react';
import './App.css';

class TeamHeader extends React.Component {
  render() {
    const data = this.props.data
    return (
      <div className={this.props.team}>
        <div>Team: {data.name}</div>
        <div>Sprint: {data.sprint.name}</div>
        <div>Goals: {data.sprint.goals}</div>
        <div>Average Forecast Accuracy: {data.sprint.accuracy * 100}%</div>
        <div>Forecast Accuracy σ: {data.sprint.accuracy * 100}%</div>
        <div>Average Scope Change: {data.sprint.change * 100}%</div>
        <div>Scope Change σ: {data.sprint.change * 100}%</div>
      </div>
    )
  }
}

class BarChart extends React.Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const barData = this.props.data.map(item => ({
      forecast: item.forecast,
      actual: item.actual
    })
    )
    // const accuracyData = this.props.data.map(item => item.accuracy)
    // const changeData = this.props.data.map(item => item.change)
    const keys = Object.keys(barData[0])
    const colors = { forecast: "green", actual: "blue" }
    const bars = { forecast: 0, actual: 30 }
    const width = barData.length * 75
    const selector = "." + this.props.chart

    const svg = d3.select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", 300)
      .style("margin-left", 100)

    svg.selectAll("g")
      .data(barData)
      .join("g")
      .attr("transform", (d, i) => `translate(${i * 75},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", d => bars[d.key])
      .attr("y", d => 300 - 10 * d.value)
      .attr("width", 29)
      .attr("height", d => 10 * d.value)
      .attr("fill", d => colors[d.key])
  }

  render() {
    return (
      <div className={this.props.chart}></div>
    )
  }
}

class TrendLineChart extends React.Component {
  componentDidMount() {
    this.drawChart()
  }

  drawChart() {
    const data = this.props.data
    const xTicks = this.props.xTicks
    const xLabel = this.props.xLabel
    const yLabel = this.props.yLabel
    const n = data.length

    // Linear Regression using Least Squares for trend line
    const xBar = (n - 1) / 2
    const yBar = d3.mean(data)
    const num = d3.sum(data.map((y, x) => x * y)) - n * xBar * yBar
    const den = d3.sum(data.map((y, x) => x * x)) - n * xBar * xBar
    const b = num / den
    const a = yBar - (b * xBar)

    // Display Code
    const selector = "." + this.props.chart
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const width = 700 - margin.right - margin.left
    const height = 400 - margin.top - margin.bottom
    const svg = d3.select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", 100)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleLinear()
      .domain([0, n - 1])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0])

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)
        .ticks(n)
        .tickFormat((d, i) => xTicks[i]))

    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")")
      .style("text-anchor", "middle")
      .text(xLabel)

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)
        .ticks(n))

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel)

    const trendLine = d3.line()
      .x((d, i) => xScale(i))
      .y((d, i) => yScale(a + (b * i)))

    const dataLine = d3.line()
      .x((d, i) => xScale(i)) // set the x values for the line generator
      .y(d => yScale(d)) // set the y values for the line generator

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,255,1)")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", trendLine)

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,255,0.25)")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1)
      .attr("d", dataLine)
  }

  render() {
    return (
      <div className={this.props.chart}></div>
    )
  }
}

class TeamMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamName: "No team name",
      latestSprintName: "No latest sprint name",
      avgForecastError: 0,
      forecastStdDev: 0,
      avgScopeChange: 0,
      scopeChangeStdDev: 0,
      metricData:{
        sprints: [],
        scopeChange: [],
        forecastError: [],
        typeCounts: []
      }
    }
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
          bug: d.bug_pct,
          story: d.story_pct,
          spike: d.spike_pct,
          incident: d.incident_pct,
          opWork: d.operational_work_pct,
          dataFix: d.data_fix_pct,
          techDebt: d.technical_debt_pct
        })
      })
      const teamMetrics = {
        latestSprintName: lastSprint.name,
        avgForecastError: d3.mean(metricData.forecastError),
        forecastStdDev: d3.deviation(metricData.forecastError),
        avgScopeChange: d3.mean(metricData.scopeChange),
        scopeChangeStdDev: d3.deviation(metricData.scopeChange),
        metricData: metricData
      }
      this.setState({
        teamMetrics:(
          <div>
            <hr />
            <TrendLineChart data={metricData.forecastError} xLabel="Sprint" yLabel="Forecast Error %" xTicks={metricData.sprints} chart={this.props.teamName + "ForecastErrorLineChart"} />
            <hr />
            <TrendLineChart data={metricData.scopeChange} xLabel="Sprint" yLabel="Scope Change %" xTicks={metricData.sprints} chart={this.props.teamName + "ScopeChangeLineChart"} />
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

function App() {
  return (
    <div className="App">
      <SLMetrics />
    </div>
  );
}

export default App
