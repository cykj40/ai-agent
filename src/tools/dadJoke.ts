import type { Tool, ToolInput } from '../../types'
import { z } from 'zod'
import fetch from 'node-fetch'

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
        return (await res.json()).joke
    }
}


