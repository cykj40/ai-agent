import type { AIMessage } from '../types'
import { openai } from './ai'
import { systemPrompt as defaultSystemPrompt } from './systemPrompt'
import { z } from 'zod'
import { getSummary } from './memory'
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'

const convertToOpenAIMessage = (msg: AIMessage): ChatCompletionMessageParam => {
    const baseMessage = {
        role: msg.role,
        content: msg.content ?? ''
    }

    if (msg.role === 'tool') {
        return {
            ...baseMessage,
            role: 'tool' as const,
            tool_call_id: msg.tool_call_id!
        }
    }

    if (msg.tool_calls) {
        return {
            ...baseMessage,
            role: 'assistant' as const,
            tool_calls: msg.tool_calls
        }
    }

    return baseMessage as ChatCompletionMessageParam
}

export const runLLM = async ({
    messages,
    tools = [],
    temperature = 0.1,
    systemPrompt = defaultSystemPrompt,
}: {
    messages: AIMessage[]
    tools?: any[]
    temperature?: number
    systemPrompt?: string
}) => {
    const formattedTools = tools.map(tool => ({
        type: 'function' as const,
        function: {
            name: tool.function.name,
            description: tool.function.description,
            parameters: tool.function.parameters
        }
    })) satisfies ChatCompletionTool[]

    const summary = await getSummary()

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        temperature,
        messages: [
            {
                role: 'system',
                content: `${systemPrompt}. Conversation summary so far: ${summary}`,
            },
            ...messages.map(convertToOpenAIMessage),
        ],
        ...(formattedTools.length > 0 && {
            tools: formattedTools,
            tool_choice: 'auto',
            parallel_tool_calls: false,
        }),
    })

    return response.choices[0].message
}

export const runApprovalCheck = async (userMessage: string) => {
    const response = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: zodResponseFormat(
            z.object({
                approved: z.boolean().describe('did the user say they approved or not'),
            }),
            'math_reasoning'
        ),
        messages: [
            {
                role: 'system',
                content:
                    'Determine if the user approved the image generation. If you are not sure, then it is not approved.',
            },
            { role: 'user', content: userMessage },
        ],
    })

    return response.choices[0].message.parsed?.approved
}

export const summarizeMessages = async (messages: AIMessage[]) => {
    const response = await runLLM({
        systemPrompt:
            'Summarize the key points of the conversation in a concise way that would be helpful as context for future interactions. Make it like a play by play of the conversation.',
        messages,
        temperature: 0.3,
    })

    return String(response.content || '')
}

