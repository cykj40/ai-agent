import type { Tool, ToolInput } from '../../types'
import fetch from 'node-fetch'

interface DadJokeResponse {
    joke: string;
    id: string;
    status: number;
}

export const dadJokeToolDefinition: Tool = {
    type: 'function',
    function: {
        name: 'dad_joke',
        description: 'Get a random dad joke',
        parameters: {
            type: 'object',
            properties: {}
        }
    },
    implementation: async (input: ToolInput) => {
        const res = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        })
        const data = await res.json() as DadJokeResponse
        return data.joke
    }
}


