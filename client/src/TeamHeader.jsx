import React from 'react'

export class TeamHeader extends React.Component {
  render() {
    const data = this.props.data || {}
    const teamName = data.teamName || ""
    const lastSprintName = data.lastSprintName || ""
    const lastSprintGoal = data.lastSprintGoal || ""
    const avgForecastError = data.avgForecastError
    const forecastStdDev = data.forecastStdDev
    const avgScopeChange = data.avgScopeChange
    const scopeChangeStdDev = data.scopeChangeStdDev
    return (
      <div className={teamName.replace(/\s/g, '') + "Header"}>
        <div><strong>Team:</strong> {teamName}</div>
        <p />
        <div><strong>Sprint:</strong> {lastSprintName}</div>
        <div><strong>Goal:</strong> {lastSprintGoal}</div>
        <p />
        <div><strong>Average Forecast Error:</strong> {Math.round(avgForecastError)}%</div>
        <div><strong>Forecast Error σ:</strong> {Math.round(forecastStdDev)}%</div>
        <p />
        <div><strong>Average Scope Change:</strong> {Math.round(avgScopeChange)}%</div>
        <div><strong>Scope Change σ:</strong> {Math.round(scopeChangeStdDev)}%</div>
      </div>
    )
  }
}
