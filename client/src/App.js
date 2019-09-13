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

function App() {
  return (
    <div className="App">
      <TeamHeader data={headData} team="scmdgn"/>
      <BarChart data={history} chart="scmdgnChart"/>
      <hr />
      <TeamHeader data={headData} team="sdm"/>
      <BarChart data={history} chart="sdmChart"/>
    </div>
  );
}

export default App
