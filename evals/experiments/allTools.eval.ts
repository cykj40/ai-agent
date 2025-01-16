import 'dotenv/config'
import { runLLM } from '../../src/llm'
import { redditToolDefinition } from '../../src/tools/reddit'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'
import { generateImageToolDefinition } from '../../src/tools/generateImage'
import { runEval } from '../lib/evalTools'
import { ToolCallMatch } from '../lib/scorers'

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant' as const,
    content: null,
    tool_calls: [
        {
            id: 'test-id',
            type: 'function' as const,
            function: {
                name: toolName,
                arguments: '{}'
            },
        },
    ],
})

export const allToolsEval = () => runEval('allTools', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [redditToolDefinition, dadJokeToolDefinition, generateImageToolDefinition],
        }),
    data: [
        {
            input: 'find me something interesting on reddit',
            expected: createToolCallMessage(redditToolDefinition.function.name),
        },
        {
            input: 'tell me a dad joke',
            expected: createToolCallMessage(dadJokeToolDefinition.function.name),
        },
        {
            input: 'generate an image of a sunset',
            expected: createToolCallMessage(generateImageToolDefinition.function.name),
        },
    ],
    scorers: [ToolCallMatch],
})