import type { OpenAI } from 'openai'

export type AIMessage =
    | OpenAI.Chat.Completions.ChatCompletionMessageParam
    | { role: 'user'; content: string }
    | { role: 'tool'; content: string; tool_call_id: string }

export interface ToolFn<A = any, T = any> {
    (input: { userMessage: string; toolArgs: A }): Promise<T>
}

export interface Tool {
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
    implementation: (...args: any[]) => Promise<any>;
}
