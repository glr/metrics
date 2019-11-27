import * as d3 from "d3"
import React from 'react'

export class TrendLineChart extends React.Component {
    componentDidMount() {
      this.drawChart()
    }
  
    componentDidUpdate() {
      // todo: there has to be a better way to update the chart rendering when things change... 
      const selector = "." + this.props.chart
      d3.select(selector + '> svg').remove()
      this.drawChart()
    }
    
    drawChart() {
      const data = this.props.data || []
      const xTicks = this.props.xTicks || []
      const xLabel = this.props.xLabel || ""
      const yLabel = this.props.yLabel || ""
      const n = data.length || 0
  
      // Linear Regression using Least Squares for trend line
      const xBar = (n - 1) / 2
      const yBar = d3.mean(data)
      const num = d3.sum(data.map((y, x) => x * y)) - n * xBar * yBar
      const den = d3.sum(data.map((y, x) => x * x)) - n * xBar * xBar
      const b = num / den
      const a = yBar - (b * xBar)
  
      // Display Code
      const selector = "." + this.props.chart
      const margin = { top: 50, right: 150, bottom: 50, left: 50 }
      const width = 800 - margin.right - margin.left
      const height = 400 - margin.top - margin.bottom
      const svg = d3.select(selector)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", 50)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
      const xScale = d3.scaleLinear()
        .domain([0, n - 1])
        .range([0, width])
  
      const yScaleTop = d3.max(data) || 0
      const yScale = d3.scaleLinear()
        .domain([0, yScaleTop])
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


    //draw goal
    const goal = [20]
    const goalBar = svg.selectAll(".goal")
      .data(goal)
      .enter()
      .append("rect")
      .attr("x", d => xScale(0))
      .attr("y", d => yScale(d) < 0 ? 0 : yScale(d))
      .attr("width", width)
      .attr("height", (d, i) => {
        const h = d < d3.max(yScale.domain()) ? d : d3.max(yScale.domain())
        return yScale(0) - yScale(h)
      })
      .attr("fill", "green")
      .style("opacity", 0.1)
    }
  
    render() {
      return (
        <div className={this.props.chart}></div>
      )
    }
  }