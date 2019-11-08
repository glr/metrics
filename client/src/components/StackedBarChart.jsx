import * as d3 from "d3"
import last from "lodash/last"
import first from "lodash/first"
import React from 'react'

export class StackedBarChart extends React.Component {
    componentDidMount() {
      this.drawChart()
    }
  
    drawChart() {
      const barData = this.props.data
      const n = barData.length
      const xTicks = this.props.xTicks
      const xLabel = this.props.xLabel
      const yLabel = this.props.yLabel
      const additionalHoverText = this.props.additionalHoverText || ""
      const hoverPrec = this.props.hoverPrec || 0
      const categories = Object.keys(first(barData))
      
      // Display Code
      const selector = "." + this.props.chart
      const margin = { top: 50, right: 150, bottom: 50, left: 50 }
      const width = 800 - margin.right - margin.left
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
        .paddingInner(0.15)
  

      const yMax = d3.max(barData.map((d, i) => {
        return d3.sum(Object.values(d))
      }))
      
      const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0])
  
      // const colors = d3.scaleOrdinal().domain(last(barData)).range(d3.interpolatePlasma)
    //   const colors = d3.scaleSequential(d3.interpolateRainbow)
      const colorRange = d3.scaleLinear()
        .domain([0, categories.length-1])
        .range([1, 0])
      const colors = d3.interpolateRdYlBu
    //   const colors = d3.scaleOrdinal(d3.schemeSet1)
      
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

      svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yLabel)

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
          .style("fill", (d, i) => colors(colorRange(i)))
  
      const rect = groups.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
          .attr("x", (d, i) => xScale(xTicks[i]))
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]))
          .attr("width", xScale.bandwidth())
          .on("mouseover", () => tooltip.style("display", null))
          .on("mouseout", () => tooltip.style("display", "none"))
          .on("mousemove", function (d) {
            let xPosition = d3.mouse(this)[0] - 15
            let yPosition = d3.mouse(this)[1] - 25
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
            tooltip.select("text").text((d[1]-d[0]).toFixed(hoverPrec) + additionalHoverText)
          })
  
      // Draw legend
      const legend = svg.selectAll(".legend")
        .data(categories)
        .enter()
        .append("g")
          .attr("class", "legend")
          .attr("transform", (d, i) => "translate(30," + i * 19 + ")")
  
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => colors(colorRange(i)))
  
      legend.append("text") 
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d, i) => Object.keys(first(barData))[i])
  
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
    }
  
    render() {
      return (
        <div className={this.props.chart}></div>
      )
    }
  }
