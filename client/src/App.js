import React from 'react';
// import logo from './logo.svg';
import * as d3 from "d3";
import './App.css';

const headData = {
  name:"Scrumudgeons",
  sprint:{
    id:2119,
    name:"SCMDGN Sprint 2119",
    goals:"This is a fake goal. So is this.",
    accuracy:0.78,
    change:0,
    forecast:24,
    actual:27
  }
}
const history = [
  {
    forecast:20,
    actual:14,
    accuracy:0.7,
    change:0.01
  },
  {
    forecast:14,
    actual:16,
    accuracy:0.87,
    change:0
  },
  {
    forecast:16,
    actual:15,
    accuracy:0.94,
    change:0
  },
  {
    forecast:15,
    actual:15,
    accuracy:1,
    change:0
  },
  {
    forecast:15,
    actual:16,
    accuracy:0.94,
    change:0.01
  },
  {accuracy:0.78,
  change:0,
  forecast:24,
  actual:27}
]

const linearData = {
  scopeChange: [0.23, 0.09, 0.01, 0.22, 0.26, 0],
  forecastError: [0.53, 4.50, 1.43, 1.01, 0.23, 1.14],
  sprints: ["1920", "1921", "1922", "1923", "1924", "1925"]
}
class TeamHeader extends React.Component {
  render() {
    const data = this.props.data
    return (
      <div className={this.props.team}>
        <div>Team: {data.name}</div>
        <div>Sprint: {data.sprint.name}</div>
        <div>Goals: {data.sprint.goals}</div>
        <div>Forecast Accuracy: {data.sprint.accuracy * 100}%</div>
        <div>Scope Change: {data.sprint.change * 100}%</div>
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
      forecast:item.forecast,
      actual:item.actual
      })
    )
    // const accuracyData = this.props.data.map(item => item.accuracy)
    // const changeData = this.props.data.map(item => item.change)
    const keys = Object.keys(barData[0])
    const colors = {forecast:"green", actual:"blue"}
    const bars = {forecast:0, actual:30}
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
      .attr("transform", (d, i) => `translate(${i*75},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .join("rect")
      .attr("x", d => bars[d.key])
      .attr("y", d => 300 - 10 * d.value)
      .attr("width", 29)
      .attr("height", d => 10 * d.value)
      .attr("fill", d => colors[d.key])
  }

  render() {
    return(
      <div className={this.props.chart}></div>
    )
  }
}

class LinRegChart extends React.Component {
  componentDidMount() {
    this.drawChart()
  }

  drawChart() {
    const selector = "." + this.props.chart
    const forecastError = this.props.data.forecastError
    // const scopeChange = this.props.data.scopeChange
    // const sprints = this.props.data.sprints
    const width = 700
    const height = 300
    const n = forecastError.length

    // Linear Regression using Least Squares for trend line
    const xBar = (n-1)/2 
    const yBar = d3.mean(forecastError)
    const num = forecastError.reduce((acc, y, x) => acc + ((x - xBar) * (y - yBar)))
    const den = forecastError.reduce((acc, y, x) => acc + ((x - xBar) * (x - xBar)))
    const b = num/den
    const a = yBar - (b * xBar)

    const xScale = d3.scaleLinear()
    .domain([0, n-1])
    .range([0, width])

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(forecastError)])
    .range([height, 0])

    const trendLine = d3.line()
    .x((d, i) => xScale(i))
    .y((d, i) => yScale(a+(b*i)))

    const dataLine = d3.line()
    .x((d, i)=> xScale(i)) // set the x values for the line generator
    .y(d => yScale(d)) // set the y values for the line generator

    const svg = d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-left", 100)

    svg.append("path")
    .datum(forecastError)
    .attr("fill", "none")
    .attr("stroke", "rgba(0,0,255,1)")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 4)
    .attr("d", trendLine)
    
    svg.append("path")
    .datum(forecastError)
    .attr("fill", "none")
    .attr("stroke", "rgba(0,0,255,0.25)")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1)
    .attr("d", dataLine)
  }

  render() {
    return(
      <div className={this.props.chart}></div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <TeamHeader data={headData} team="scmdgn"/>
      <BarChart data={history} chart="scmdgnChart"/>
      <hr />
      <TeamHeader data={headData} team="sdm"/>
      <BarChart data={history} chart="sdmChart"/>
      <hr />
      <LinRegChart data={linearData} chart="sdmLinChart"/>
    </div>
  );
}

export default App
