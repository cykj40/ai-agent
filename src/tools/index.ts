import { dadJokeToolDefinition } from './dadJoke'
import { generateImageToolDefinition } from './generateImage'
import { redditToolDefinition } from './reddit'

export const tools = [
    generateImageToolDefinition,
    dadJokeToolDefinition,
    redditToolDefinition
]

export { generateImageToolDefinition } from './generateImage'
export { dadJokeToolDefinition } from './dadJoke'
export { redditToolDefinition } from './reddit'