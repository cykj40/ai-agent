import { runLLM } from '../src/llm'
import { dadJokeToolDefinition } from '../src/tools/dadJoke'
import { createToolCallMessage, runEval } from './evalTools'

export const dadJokeEval = async () => {
    await runEval('dadJoke', {
        task: (input: string) =>
            runLLM({
                messages: [{ role: 'user', content: input }],
                tools: [dadJokeToolDefinition]
            }),
        data: [
            { input: 'tell me a dad joke', expected: createToolCallMessage('dad_joke') }
        ],
        scorers: []
    })
} 