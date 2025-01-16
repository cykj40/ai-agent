import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'
import type { Experiment, Set } from '../../../types'

interface Props {
    experiment: Experiment
}

const ExperimentGraph = ({ experiment }: Props) => {
    const data = experiment.sets.map((set: Set, index: number) => ({
        name: `Run ${index + 1}`,
        score: set.score,
    }))

    return (
        <div className="graph">
            <h2>{experiment.name}</h2>
            <LineChart width={800} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </div>
    )
}

export default ExperimentGraph