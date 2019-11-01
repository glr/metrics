import * as d3 from "d3"
import React from 'react'

export class TrendLineChart extends React.Component {
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