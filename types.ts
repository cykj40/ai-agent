import type { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from 'openai/resources/chat/completions'

export type ToolCall = ChatCompletionMessageToolCall

export type Tool = {
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

export type AIMessage = ChatCompletionMessageParam

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
