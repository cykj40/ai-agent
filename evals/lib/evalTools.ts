import 'dotenv/config'
import type { Score, Scorer } from 'autoevals'
import chalk from 'chalk'
import { JSONFilePreset } from 'lowdb/node'

type TaskResult<T> = {
    context?: string | string[];
    response?: string;
    output?: T;
}

type Run = {
    input: any;
    output: any;
    expected: any;
    scores: {
        name: Score['name'];
        score: number;
    }[];
    createdAt?: string;
}

type Set = {
    runs: Run[]
    score: number
    createdAt: string
}

type Experiment = {
    name: string
    sets: Set[]
}

type Data = {
    experiments: Experiment[]
}

const defaultData: Data = {
    experiments: [],
}

const getDb = async () => {
    const db = await JSONFilePreset<Data>('results.json', defaultData)
    return db
}

const calculateAvgScore = (runs: Run[]) => {
    const totalScores = runs.reduce((sum, run) => {
        const runAvg =
            run.scores.reduce((sum, score) => {
                const validScore = typeof score.score === 'number' ? score.score : 0
                return sum + validScore
            }, 0) / run.scores.length
        return sum + runAvg
    }, 0)
    return totalScores / runs.length
}

export const loadExperiment = async (
    experimentName: string
): Promise<Experiment | undefined> => {
    const db = await getDb()
    return db.data.experiments.find((e) => e.name === experimentName)
}

export const saveSet = async (
    experimentName: string,
    runs: Omit<Run, 'createdAt'>[]
) => {
    const db = await getDb()

    const runsWithTimestamp = runs.map((run) => ({
        ...run,
        createdAt: new Date().toISOString(),
    }))

    const newSet = {
        runs: runsWithTimestamp,
        score: calculateAvgScore(runsWithTimestamp),
        createdAt: new Date().toISOString(),
    }

    const existingExperiment = db.data.experiments.find(
        (e) => e.name === experimentName
    )

    if (existingExperiment) {
        existingExperiment.sets.push(newSet)
    } else {
        db.data.experiments.push({
            name: experimentName,
            sets: [newSet],
        })
    }

    await db.write()
}

export const runEval = async <T = any>(
    experiment: string,
    config: {
        task: (input: any) => Promise<T | TaskResult<T>>
        data: { input: any; expected?: T; reference?: string | string[] }[]
        scorers: Scorer<T, any>[]
    }
) => {
    const results = await Promise.all(
        config.data.map(async ({ input, expected, reference }) => {
            const result = await config.task(input)
            console.log('Run result:', {
                input,
                output: result,
                expected,
                scores: await Promise.all(
                    config.scorers.map(async (scorer) => {
                        const score = await scorer({
                            input,
                            output: result,
                            expected,
                            reference,
                        })
                        return score
                    })
                )
            })

            let context: string | string[] | undefined
            let output: T

            if (result && typeof result === 'object' && 'context' in result) {
                const taskResult = result as TaskResult<T>
                context = taskResult.context
                output = taskResult.output ?? result as T
            } else {
                output = result as T
            }

            const scores = await Promise.all(
                config.scorers.map(async (scorer) => {
                    const score = await scorer({
                        input,
                        output,
                        expected,
                        reference,
                        context,
                    })
                    return {
                        name: score.name,
                        score: score.score ?? 0,
                    }
                })
            )

            return {
                input,
                output,
                expected,
                scores,
            }
        })
    )

    const previousExperiment = await loadExperiment(experiment)
    const previousScore =
        previousExperiment?.sets[previousExperiment.sets.length - 1]?.score || 0
    const currentScore = calculateAvgScore(results)
    const scoreDiff = currentScore - previousScore

    const color = previousExperiment
        ? scoreDiff > 0
            ? chalk.green
            : scoreDiff < 0
                ? chalk.red
                : chalk.blue
        : chalk.blue

    console.log(`Experiment: ${experiment}`)
    console.log(`Previous score: ${color(previousScore.toFixed(2))}`)
    console.log(`Current score: ${color(currentScore.toFixed(2))}`)
    console.log(
        `Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}`
    )
    console.log()

    await saveSet(experiment, results)

    return results
}