import { redditEval } from './reddit'
import { dadJokeEval } from './dadJoke.eval.ts'

const evalName = process.argv[2]

if (!evalName) {
    console.error('Please provide an eval name')
    process.exit(1)
}

const evals: Record<string, () => Promise<void>> = {
    reddit: redditEval,
    dadJoke: dadJokeEval,
}

const selectedEval = evals[evalName]

if (!selectedEval) {
    console.error(`No eval found for ${evalName}`)
    process.exit(1)
}

await selectedEval() 