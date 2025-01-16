import 'dotenv/config'

import { runLLM } from '../../src/llm'
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

export const generateImageEval = () => runEval('generateImage', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [generateImageToolDefinition],
        }),
    data: [
        {
            input: 'Generate an image of a sunset',
            expected: createToolCallMessage(generateImageToolDefinition.function.name),
        },
        {
            input: 'take a photo of the sunset',
            expected: createToolCallMessage(generateImageToolDefinition.function.name),
        },
    ],
    scorers: [ToolCallMatch],
})