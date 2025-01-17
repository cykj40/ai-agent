import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

let messages: ChatCompletionMessageParam[] = []

export const addMessages = async (newMessages: ChatCompletionMessageParam[]) => {
    messages = [...messages, ...newMessages]
}

export const getMessages = async () => messages

export const clearMessages = async () => {
    messages = []
}
