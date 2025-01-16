import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'
import type { Experiment } from '../../../types'

interface Props {
    experiment: Experiment
}

const ExperimentGraph = ({ experiment }: Props) => {
    const data = experiment.sets.map((set, index) => ({
        name: `Run ${index + 1}`,
        score: set.score,
        date: new Date(set.createdAt).toLocaleDateString(),
        runs: set.runs.length
    }))

    console.log('Graph data:', data)  // Debug log

    if (data.length === 0) {
        return <div>No data available for this experiment</div>
    }

    return (
        <div className="graph">
            <h2>{experiment.name}</h2>
            <div style={{ overflowX: 'auto' }}>
                <LineChart width={800} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip
                        formatter={(value: number) => value.toFixed(2)}
                        labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </div>
        </div>
    )
}

export default ExperimentGraph