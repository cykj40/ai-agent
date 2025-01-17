import { tools } from './tools'
import type { ToolCall } from '../types'

export const runTool = async (toolCall: ToolCall, userMessage: string) => {
    const tool = tools.find(t => t.function.name === toolCall.function.name)

    if (!tool) {
        throw new Error(`Unknown tool: ${toolCall.function.name}`)
    }

    try {
        const toolArgs = JSON.parse(toolCall.function.arguments)
        const result = await tool.implementation({ toolArgs, userMessage })

        // Always return a string
        if (typeof result === 'string') {
            return result
        }

        try {
            return JSON.stringify(result)
        } catch {
            return String(result)
        }
    } catch (error) {
        console.error('Tool execution failed:', error)
        return 'Failed to execute tool'
    }
}


