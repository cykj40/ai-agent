import type { ChatCompletionMessage, ChatCompletionMessageToolCall } from 'openai/resources/chat/completions'

export type ToolCall = ChatCompletionMessageToolCall

export type Tool = {
    name: string
    type: 'function'
    function: {
        name: string
        description: string
        parameters: {
            type: 'object'
            properties: Record<string, unknown>
            required?: string[]
        }
    }
    implementation: ToolFn<any, any>
}

export type ToolFn<Args, Result> = (input: {
    toolArgs: Args
    userMessage: string
}) => Promise<Result>

export type AIMessage = {
    role: 'user' | 'assistant' | 'system' | 'tool'
    content: string | null
    tool_calls?: ChatCompletionMessageToolCall[]
    tool_call_id?: string
}

export type Dict = Record<string, any>

export type Run = {
    input: any
    output: any
    expected: any
    scores: {
        name: string
        score: number
    }[]
    createdAt?: string
}

export type Set = {
    runs: Run[]
    score: number
    createdAt: string
}

export type Experiment = {
    name: string
    sets: Set[]
}

export type Results = {
    experiments: Experiment[]
}
