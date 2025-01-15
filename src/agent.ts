import type { AIMessage } from '../types'
import { addMessages, getMessages, clearMessages } from './memory'
import { runLLM } from './llm'
import { showLoader } from './ui'
import { runTool } from './toolRunner'

export const runAgent = async ({
    userMessage,
    tools,
}: {
    userMessage: string,
    tools: any[],
}): Promise<AIMessage[]> => {
    // Start fresh
    await clearMessages()
    await addMessages([{ role: 'user', content: userMessage }])
    const loader = showLoader('🤔')

    try {
        while (true) {
            const messages = await getMessages()
            const response = await runLLM({
                messages,
                tools,
            })

            if (!response.tool_calls) {
                await addMessages([response])
                break
            }

            // Add assistant response with tool calls
            await addMessages([response])

            // Process all tool calls before continuing
            const toolPromises = response.tool_calls.map(async (toolCall) => {
                const result = await runTool(toolCall, userMessage)
                return {
                    role: 'tool',
                    content: result,
                    tool_call_id: toolCall.id
                } as AIMessage
            })

            const toolResponses = await Promise.all(toolPromises)
            await addMessages(toolResponses)
        }
    } finally {
        loader.stop()
    }

    return getMessages()
}
