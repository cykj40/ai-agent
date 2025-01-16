import { runLLM } from '../../src/llm'
import { redditToolDefinition } from '../../src/tools/reddit'
import { runEval } from '../lib/evalTools'
import { ToolCallMatch } from '../lib/scorers'
import type { AIMessage, ToolCall } from '../../types'

const createToolCallMessage = (toolName: string): AIMessage => ({
    role: 'assistant',
    content: null,
    tool_calls: [{
        id: 'test-id',
        type: 'function' as const,
        function: {
            name: toolName,
            arguments: '{}'  // Required by OpenAI's type
        }
    }] as ToolCall[]
})

export const redditEval = async () => {
    await runEval('reddit', {
        task: (input: string) =>
            runLLM({
                messages: [{ role: 'user', content: input }],
                tools: [redditToolDefinition],
            }),
        data: [
            {
                input: 'find me something interesting on reddit',
                expected: createToolCallMessage(redditToolDefinition.function.name),
            },
        ],
        scorers: [ToolCallMatch],
    })
} 