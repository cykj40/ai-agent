import type { AIMessage, Tool } from '../types'
import { addMessages, getMessages, saveToolResponse } from './memory'
import { runLLM } from './llm'
import { showLoader, logMessage } from './ui'
import { runTool } from './toolRunner'
import { generateImageToolDefinition } from './tools/generateImage'
import * as readline from 'readline'
import type { ChatCompletionMessage } from 'openai/resources/chat/completions'

const convertToAIMessage = (msg: ChatCompletionMessage): AIMessage => {
    const base = {
        role: msg.role,
        content: msg.content ?? '',
        tool_calls: msg.tool_calls
    }

    if ('tool_call_id' in msg) {
        return {
            ...base,
            tool_call_id: (msg as any).tool_call_id
        }
    }

    return base
}

const getUserInput = async (prompt: string): Promise<string> => {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question(prompt, (answer) => {
            rl.close()
            resolve(answer.toLowerCase().trim())
        })
    })
}

export const runAgent = async ({
    userMessage,
    tools,
}: {
    userMessage: string
    tools: Tool[]
}) => {
    try {
        await addMessages([{ role: 'user', content: userMessage }])
        let loader = showLoader('Thinking...')

        try {
            const history = await getMessages()
            const response = await runLLM({ messages: history, tools })
            loader.stop()

            if (response.tool_calls?.[0]?.function.name === generateImageToolDefinition.function.name) {
                const answer = await getUserInput('\nDo you want me to generate this image? (yes/no)\n> ')

                if (answer.startsWith('y')) {
                    loader = showLoader('Generating image...')
                    const toolCall = response.tool_calls[0]
                    const toolResponse = await runTool(toolCall, userMessage)
                    loader.stop()

                    await addMessages([
                        convertToAIMessage(response),
                        {
                            role: 'tool',
                            content: toolResponse,
                            tool_call_id: toolCall.id
                        }
                    ])
                    console.log('\nImage URL:', toolResponse)
                } else {
                    await addMessages([
                        convertToAIMessage(response),
                        {
                            role: 'tool',
                            content: 'User did not approve image generation.',
                            tool_call_id: response.tool_calls[0].id
                        }
                    ])
                    console.log('\nImage generation cancelled.')
                }
            } else {
                await addMessages([convertToAIMessage(response)])
                if (response.content) {
                    logMessage(response)
                }
            }

            return getMessages()
        } finally {
            loader.stop()
        }
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

export const runAgentEval = async ({
    userMessage,
    tools,
}: {
    userMessage: string
    tools: any[]
}) => {
    let messages: AIMessage[] = [{ role: 'user', content: userMessage }]

    while (true) {
        const response = await runLLM({ messages, tools })
        messages = [...messages, response]

        if (response.content) {
            return messages
        }

        if (response.tool_calls) {
            const toolCall = response.tool_calls[0]

            if (toolCall.function.name === generateImageToolDefinition.name) {
                return messages
            }

            const toolResponse = await runTool(toolCall, userMessage)
            messages = [
                ...messages,
                { role: 'tool', content: toolResponse, tool_call_id: toolCall.id },
            ]
        }
    }
}
