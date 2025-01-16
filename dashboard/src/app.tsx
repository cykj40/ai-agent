import { useEffect, useState } from 'react'
import ExperimentGraph from './components/ExperimentGraph'
import type { Results } from '../../types'
import './App.css'

const App = () => {
    const [results, setResults] = useState<Results>({ experiments: [] })
    const [selectedExperiment, setSelectedExperiment] = useState<string>('')

    useEffect(() => {
        // Fetch results from the results.json file
        fetch('/results.json')
            .then(res => res.json())
            .then(data => {
                console.log('Loaded results:', data) // Debug log
                setResults(data)
            })
            .catch(err => {
                console.error('Failed to load results:', err)
            })
    }, [])

    console.log('Current state:', { results, selectedExperiment }) // Debug log

    const currentExperiment = results.experiments.find(
        (exp) => exp.name === selectedExperiment
    )

    const limitedExperiment = currentExperiment
        ? {
            ...currentExperiment,
            sets: currentExperiment.sets.slice(-10),
        }
        : null

    return (
        <div className="app">
            <h1>Experiment Results Viewer</h1>

            <div className="controls">
                <label htmlFor="experiment-select">Select Experiment: </label>
                <select
                    id="experiment-select"
                    value={selectedExperiment}
                    onChange={(e) => setSelectedExperiment(e.target.value)}
                >
                    <option value="">Select an experiment</option>
                    {results.experiments.map((exp) => (
                        <option key={exp.name} value={exp.name}>
                            {exp.name}
                        </option>
                    ))}
                </select>
            </div>

            {limitedExperiment && <ExperimentGraph experiment={limitedExperiment} />}
        </div>
    )
}

export default App