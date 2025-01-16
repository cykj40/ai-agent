import { runEval } from 'autoevals'
import { runLLM } from '../../src/llm'
import { redditToolDefinition } from '../../src/tools/reddit'
import { ToolCallMatch } from '../scorers'


const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [{
        type: 'function',
        function: {
            name: toolName,
        },
    }]
})

runEval('reddit', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [redditToolDefinition]
        })
    data: [
        { input: 'find me something intresting o reddit', expected: createToolCallMessage('redditToolDefinition') }
    ],
    scorers: [ToolCallMatch]
})