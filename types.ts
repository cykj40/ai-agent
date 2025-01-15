import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export type AIMessage = ChatCompletionMessageParam

export type ToolInput = {
    userMessage: string;
    toolArgs: Record<string, any>;
}

export type ToolFn = (input: ToolInput) => Promise<any>

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
    implementation: ToolFn;
}
