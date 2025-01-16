import { redditEval } from './reddit'
import { dadJokeEval } from './experiments/dadJoke.eval'
import { generateImageEval } from './experiments/generateImage.eval'
import { allToolsEval } from './experiments/allTools.eval'

const evalName = process.argv[2]

if (!evalName) {
    console.error('Please provide an eval name')
    process.exit(1)
}

type EvalFn = () => Promise<any>

const evals: Record<string, EvalFn> = {
    reddit: redditEval,
    dadJoke: dadJokeEval,
    generateImage: generateImageEval,
    allTools: allToolsEval,
}

const selectedEval = evals[evalName]

if (!selectedEval) {
    console.error(`No eval found for ${evalName}`)
    process.exit(1)
}

await selectedEval() 