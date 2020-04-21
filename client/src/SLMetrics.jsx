import React from 'react'
import TeamMetrics from './TeamMetrics.jsx'
import TeamBugs from './TeamBugs.jsx'

class SLMetrics extends React.Component {
  constructor(props) {
    super(props)
    this.state={teamMetrics:[]}
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/teams')
    .then(results => {
      return results.json()
    })
    .then(data => {
      this.setState({teamMetrics: data})
    })
  }

  render() {
    return(
      this.state.teamMetrics.map((d, key) => 
        <div key={key}>
          <TeamMetrics showBarValues={this.props.showBarValues} team={d.id} teamName={d.name} />
          {/* <TeamBugs showBarValues={this.props.showBarValues} team={d.id} teamName={d.name} /> */}
        </div>)
    )
  }
}
export default SLMetrics