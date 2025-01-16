import type { AIMessage, Tool, ToolCall } from '../types'
import { addMessages, getMessages } from './memory'
import { runLLM } from './llm'
import { showLoader } from './ui'
import { runTool } from './toolRunner'

const isMessageWithTools = (message: AIMessage): message is AIMessage & { tool_calls: ToolCall[] } => {
    return 'tool_calls' in message && Array.isArray(message.tool_calls)
}

export const runAgent = async ({
    userMessage,
    tools,
}: {
    userMessage: string,
    tools: Tool[],
}): Promise<AIMessage[]> => {
    await addMessages([{ role: 'user', content: userMessage }])
    const loader = showLoader('🤔')

    try {
        while (true) {
            const messages = await getMessages()
            const response = await runLLM({ messages, tools })

            if (!isMessageWithTools(response)) {
                await addMessages([response])
                break
            }

            await addMessages([response])

            const toolPromises = response.tool_calls.map(async (toolCall: ToolCall) => {
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
