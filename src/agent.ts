import type { AIMessage } from '../types'
import { addMessages, getMessages } from './memory'
import { runLLM } from './llm'
import { showLoader } from './ui'

export const runAgent = async ({
    userMessage,
    tools,
}: {
    userMessage: string,
    tools: any[],
}) => {
    await addMessages([{ role: 'user', content: userMessage }])

    const loader = showLoader('🤔')
    const history = await getMessages()

    const response = await runLLM({
        messages: history,
        tools,
    })

    // First add the assistant's response with tool_calls
    await addMessages([response])

    if (response.tool_calls) {
        // Then handle each tool call
        for (const toolCall of response.tool_calls) {
            const tool = tools.find(t =>
                t.function?.name === toolCall.function.name
            );

            if (tool) {
                const toolResult = await tool.implementation(
                    JSON.parse(toolCall.function.arguments)
                )

                // Add tool response after the assistant's message
                await addMessages([{
                    role: 'tool',
                    content: JSON.stringify(toolResult),
                    tool_call_id: toolCall.id
                }])
            }
        }

        // Get updated history and make final call
        const updatedHistory = await getMessages()
        const finalResponse = await runLLM({
            messages: updatedHistory,
            tools,
        })
        await addMessages([finalResponse])
    }

    loader.stop()
    return getMessages()
}
