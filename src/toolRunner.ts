import type OpenAI from 'openai'
import { generateImage } from './tools/generateImage'
import { dadJokeToolDefinition } from './tools/dadJoke'
import { redditToolDefinition } from './tools/reddit'

export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string,
) => {
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
    }
    switch (toolCall.function.name) {
        case 'generateImage':
            return generateImage(input)
        case redditToolDefinition.function.name:
            return redditToolDefinition.implementation(input)
        case dadJokeToolDefinition.function.name:
            return dadJokeToolDefinition.implementation(input)
        default:
            throw new Error(`Unknown tool: ${toolCall.function.name}`)
    }
}


