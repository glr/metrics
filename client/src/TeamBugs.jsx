import React from 'react'
import { WatermarkLineChart }  from './components/components.jsx'

class TeamBugs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const chartData = {
            data: [],
            dates:[],
            watermark:[]
        }
        fetch('http://localhost:3000/api/v1/bugs/' + this.props.team)
        .then(results => {
            return results.json()
        })
        .then(data => {
            data.map(d => {
                chartData.data.push(d.trend)
                chartData.dates.push(d.date)
                chartData.watermark.push(20)
            })
        })
    }

    render() {
        return(
            <div className="teamBugs">
                {this.props.teamName} Bugs
                <WatermarkLineChart chart={(this.props.teamName + "WatermarkLineChart").replace(/\s/g, '')} />
            </div>
        )
    }
}
export default TeamBugs