import 'dotenv/config'
import { z } from 'zod'
import { runAgent } from './src/agent'
import { dadJokeToolDefinition } from './src/tools/dadJoke'
import { generateImageToolDefinition } from './src/tools/generateImage'
import type { Tool } from './types'

const main = async () => {
    console.log('Starting application...')
    const userMessage = process.argv[2]
    if (!userMessage) {
        console.error('Please provide a message')
        process.exit(1)
    }

    console.log('User message:', userMessage)
    try {
        const response = await runAgent(userMessage)
        console.log('Agent response:', response)
    } catch (error) {
        console.error('Failed to run agent:', error)
    }
}

main()


