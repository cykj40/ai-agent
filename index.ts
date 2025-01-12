import 'dotenv/config'
import { z } from 'zod'
import { runAgent } from './src/agent'
import type { Tool } from './types'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message')
    process.exit(1)
}

const getWeather = async () => {
    return { temperature: "22°C", condition: "Sunny" }
}

const weatherTool: Tool = {
    type: 'function',
    function: {
        name: 'get_weather',
        description: 'Get the weather for a given location',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    implementation: getWeather
}

const response = await runAgent({ userMessage, tools: [weatherTool] })
console.log(response)

