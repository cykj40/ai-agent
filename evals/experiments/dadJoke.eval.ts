import 'dotenv/config'

import { runLLM } from '../../src/llm'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'
import { runEval } from '../evalTools'
import { ToolCallMatch } from '../scorers'

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

export const dadJokeEval = () => runEval('dadJoke', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [dadJokeToolDefinition],
        }),
    data: [
        {
            input: 'Tell me a funny dad joke',
            expected: createToolCallMessage(dadJokeToolDefinition.function.name),
        },
    ],
    scorers: [ToolCallMatch],
})