import * as d3 from "d3"
import React from 'react'
import last from "lodash/last"

export class DualLineChart extends React.Component {
  componentDidMount() {
    this.drawChart()
  }

  drawChart() {
    const legendText = this.props.legend
    const lineA = this.props.lineA
    const lineB = this.props.lineB
    const xTicks = this.props.xTicks
    const xLabel = this.props.xLabel
    const yLabel = this.props.yLabel
    const n = xTicks.length-1

    // Display Code
    const selector = "." + this.props.chart
    const margin = { top: 50, right: 150, bottom: 50, left: 50 }
    const width = 700 - margin.right - margin.left
    const height = 400 - margin.top - margin.bottom
    const svg = d3.select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .style("margin-left", 100)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleLinear()
      .domain([0, n])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(d3.max(lineA),d3.max(lineB))]).nice()
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

    const tks = last(yScale.domain())
    
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)
        .ticks(tks<10?tks:tks/5))

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel)

    const dataLine = d3.line()
      .x((d, i) => xScale(i)) // set the x values for the line generator
      .y(d => yScale(d)) // set the y values for the line generator

    svg.append("path")
      .datum(lineA)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,255,1)")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", dataLine)

    svg.selectAll(".dot")
      .data(lineA)
      .enter()
      .append("circle")
        .attr("fill", "rgba(0,0,255,1)")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 3)
        .on("mouseover", () => tooltip.style("display", null))
        .on("mouseout", () => tooltip.style("display", "none"))
        .on("mousemove", function (d) {
          let xPosition = d3.mouse(this)[0] - 15
          let yPosition = d3.mouse(this)[1] - 25
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
          tooltip.select("text").text(d)
        })

    svg.append("path")
      .datum(lineB)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,0,0,1)")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", dataLine)

    svg.selectAll(".dot")
      .data(lineB)
      .enter()
      .append("circle")
        .attr("fill", "rgba(255,0,0,1)")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 3)
        .on("mouseover", () => tooltip.style("display", null))
        .on("mouseout", () => tooltip.style("display", "none"))
        .on("mousemove", function (d) {
          let xPosition = d3.mouse(this)[0] - 15
          let yPosition = d3.mouse(this)[1] - 25
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
          tooltip.select("text").text(d)
        })

    // Prep the tooltip bits, initial display is hidden
    const tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none")

    tooltip.append("rect")
      .attr("width", 50)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5)

    tooltip.append("text")
      .attr("x", 25)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")

    // Draw legend
    const colors = d3.scaleOrdinal(["rgba(0,0,255,1)", "rgba(255,0,0,1)"])

    const legend = svg.selectAll(".legend")
    .data(legendText)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(30," + i * 19 + ")")

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => colors(i))

    legend.append("text") 
      .attr("x", width + 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d, i) => legendText[i])
  }

  render() {
    return (
      <div className={this.props.chart}></div>
    )
  }
}
