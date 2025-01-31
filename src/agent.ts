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
    await addMessages([{ role: 'user', content: userMessage }])
    const loader = showLoader('Thinking...')

    try {
        const history = await getMessages()
        const response = await runLLM({ messages: history, tools })

        await addMessages([response])

        if (response.tool_calls) {
            const toolCall = response.tool_calls[0]
            loader.update(`Running ${toolCall.function.name}...`)
            const toolResponse = await runTool(toolCall, userMessage)
            await saveToolResponse(toolCall.id, toolResponse)

            // Get final response after tool use
            const finalHistory = await getMessages()
            const finalResponse = await runLLM({ messages: finalHistory, tools })
            await addMessages([finalResponse])
        }

        loader.stop()
        return getMessages()
    } catch (error) {
        loader.stop()
        console.error('Agent Error:', error)
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
