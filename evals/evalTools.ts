import type { AIMessage } from '../types'

export const createToolCallMessage = (toolName: string): AIMessage => ({
    role: 'assistant',
    content: null,
    tool_calls: [{
        id: 'test-id',
        type: 'function',
        function: {
            name: toolName,
            arguments: '{}'
        }
    }]
})

export const runEval = async (
    name: string,
    config: {
        task: (input: string) => Promise<AIMessage>,
        data: { input: string, expected: AIMessage }[],
        scorers: any[]
    }
) => {
    for (const testCase of config.data) {
        const result = await config.task(testCase.input)
        console.log(`${name} eval:`, { input: testCase.input, expected: testCase.expected, result })
    }
}