import React from 'react'
import {StackedBarChart} from './components/components.jsx'

class T3Metrics extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
  
    componentDidMount() {
      fetch('http://localhost:3000/api/v1/metrics/t3')
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
        data.map((d, key) => {
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
          return true
        })
        this.setState({
          typeCounts: metricData.typeCounts,
          dates: metricData.dates
        })
      })
    }
    
    render () {
      return(
        <div>
          Tier 3 - Work Distribution
          <StackedBarChart showBarValues={this.props.showBarValues} data={this.state.typeCounts} yLabel={"Percent (by count)"} xLabel="Report Date" xTicks={this.state.dates} chart="T3IssueTypeBarChart" hoverPrec={2} additionalHoverText={"%"} />
        </div>
      )
    }
  }

export default T3Metrics