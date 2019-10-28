import React from 'react'

export class TeamHeader extends React.Component {
  render() {
    const data = this.props.data
    return (
      <div className={data.teamName.replace(/\s/g, '') + "Header"}>
        <div><strong>Team:</strong> {data.teamName}</div>
        <p />
        <div><strong>Sprint:</strong> {data.lastSprintName}</div>
        <div><strong>Goal:</strong> {data.lastSprintGoal}</div>
        <p />
        <div><strong>Average Forecast Error:</strong> {Math.round(data.avgForecastError)}%</div>
        <div><strong>Forecast Error σ:</strong> {Math.round(data.forecastStdDev)}%</div>
        <p />
        <div><strong>Average Scope Change:</strong> {Math.round(data.avgScopeChange)}%</div>
        <div><strong>Scope Change σ:</strong> {Math.round(data.scopeChangeStdDev)}%</div>
      </div>
    )
  }
}
