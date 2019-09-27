// import logo from './logo.svg';
import * as d3 from "d3"
import last from "lodash/last"
import size from "lodash/size"
import first from "lodash/first"
import React from 'react'
import './App.css'

class TeamHeader extends React.Component {
  render() {
    const data = this.props.data
    return (
      <div className={data.teamName.replace(/\s/g, '') + "Header"}>
        <div>Team: {data.teamName}</div>
        <div>Sprint: {data.lastSprintName}</div>
        <div>Goal: {data.lastSprintGoal}</div>
        <div>Average Forecast Accuracy: {Math.round(data.avgForecastError)}%</div>
        <div>Forecast Accuracy σ: {Math.round(data.forecastStdDev)}</div>
        <div>Average Scope Change: {Math.round(data.avgScopeChange)}%</div>
        <div>Scope Change σ: {Math.round(data.scopeChangeStdDev)}</div>
      </div>
    )
  }
}

class StackedBarChart extends React.Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const barData = this.props.data
    const n = barData.length
    const xTicks = this.props.xTicks
    const xLabel = this.props.xLabel
    
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

    const xScale = d3.scaleBand()
      .domain(xTicks)
      .rangeRound([0, width])
      .paddingOuter(0.1)
      .paddingInner(0.02)
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    const colors = d3.scaleOrdinal(d3.schemeSpectral[size(last(barData))])

    const stack = d3.stack()
      .keys(Object.keys(last(barData)))
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)

    const series = stack(barData)
    
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
    
    const groups = svg.selectAll("g.percent")
      .data(series)
      .enter()
      .append("g")
        .attr("class", "percent")
        .style("fill", (d, i) => colors(i))

    const rect = groups.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(xTicks[i]))
        .attr("y", d => yScale(d3.sum(d)))
        .attr("height", d => yScale(first(d)) - yScale(d3.sum(d)))
        .attr("width", xScale.bandwidth())
        // .on("mouseover", function() { tooltip.style("display", null); })
        // .on("mouseout", function() { tooltip.style("display", "none"); })
        // .on("mousemove", function(d) {
        //   var xPosition = d3.mouse(this)[0] - 15;
        //   var yPosition = d3.mouse(this)[1] - 25;
        //   tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        //   tooltip.select("text").text(d.y);
        // })

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
            <TeamHeader data={headerMetrics} />
            <p />
            <TrendLineChart data={metricData.forecastError} xLabel="Sprint" yLabel="Forecast Error %" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ForecastErrorLineChart"} />
            <p />
            <TrendLineChart data={metricData.scopeChange} xLabel="Sprint" yLabel="Scope Change %" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "ScopeChangeLineChart"} />
            <p />
            <StackedBarChart data={metricData.typeCounts} xLabel="Sprint" xTicks={metricData.sprints} chart={this.props.teamName.replace(/\s/g, '') + "IssueTypeBarChart"} />
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
