import type { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from 'openai/resources/chat/completions'

export type ToolCall = ChatCompletionMessageToolCall

export type AIMessageWithTools = {
    role: 'assistant';
    content: string | null;
    tool_calls?: ToolCall[];
}

export type AIMessage = ChatCompletionMessageParam | AIMessageWithTools

export type ToolInput<T = any> = {
    userMessage: string;
    toolArgs: T;
}

export type ToolFn<TArgs = any, TResult = string> = (input: ToolInput<TArgs>) => Promise<TResult>

export type Tool = {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required?: string[];
        };
    };
    implementation: ToolFn;
}

export type Run = {
    input: any;
    output: any;
    expected: any;
    scores: {
        name: string;
        score: number;
    }[];
    createdAt?: string;
}

export type Set = {
    runs: Run[];
    score: number;
    createdAt: string;
}

export type Experiment = {
    name: string;
    sets: Set[];
}

export type Results = {
    experiments: Experiment[];
}
