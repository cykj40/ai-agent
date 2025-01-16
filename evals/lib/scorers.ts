import type { AIMessage } from '../../types'
import type { Score, Scorer } from 'autoevals'

export const ToolCallMatch: Scorer<AIMessage, any> = async (args) => {
    const { output, expected } = args

    if (!output || !expected) {
        return {
            name: 'ToolCallMatch',
            score: 0
        }
    }

    const isAssistant = output.role === 'assistant'
    const hasToolCalls = 'tool_calls' in output && Array.isArray(output.tool_calls)
    const hasExpectedToolCalls = 'tool_calls' in expected && Array.isArray(expected.tool_calls)

    if (!isAssistant || !hasToolCalls || !hasExpectedToolCalls) {
        return {
            name: 'ToolCallMatch',
            score: 0
        }
    }

    const outputName = output.tool_calls[0]?.function?.name
    const expectedName = expected.tool_calls[0]?.function?.name

    return {
        name: 'ToolCallMatch',
        score: outputName === expectedName ? 1 : 0
    }
} 