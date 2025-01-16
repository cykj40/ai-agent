import OpenAI from 'openai'
import type { AIMessage } from '../types'
import type { Tool } from '../types'

const openai = new OpenAI()

export const runLLM = async ({
    messages,
    tools = [],
}: {
    messages: AIMessage[];
    tools?: Tool[];
}): Promise<AIMessage> => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        tools: tools.map(tool => ({
            type: tool.type,
            function: tool.function
        })),
    })

    return response.choices[0].message
}

