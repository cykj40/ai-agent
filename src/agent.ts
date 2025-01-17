import { openai } from './ai'
import { addMessages, getMessages, clearMessages } from './memory'
import { runTool } from './toolRunner'
import { tools } from './tools'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export const runAgent = async (userMessage: string) => {
    if (typeof userMessage !== 'string') {
        throw new Error('User message must be a string')
    }

    await clearMessages()

    const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: 'You are a helpful assistant that can search for movies and generate images. When asked about movies, use the search_movies tool first to get information. When asked to create images or posters, use the generate_image tool with a detailed prompt.'
    }

    const userMsg: ChatCompletionMessageParam = {
        role: 'user',
        content: userMessage.toString()
    }

    // Debug log
    console.log('System message:', systemMessage)
    console.log('User message:', userMsg)

    const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [systemMessage, userMsg],
        tools: tools.map(tool => ({
            type: tool.type,
            function: tool.function,
        })),
    })

    const message = response.choices[0].message
    await addMessages([systemMessage, userMsg, message])

    if (message.tool_calls) {
        for (const toolCall of message.tool_calls) {
            const result = await runTool(toolCall, userMessage)
            await addMessages([{
                role: 'tool',
                content: result,
                tool_call_id: toolCall.id
            }])
        }

        const messages = await getMessages()
        const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages,
        })

        await addMessages([finalResponse.choices[0].message])
        return finalResponse.choices[0].message
    }

    return message
}
