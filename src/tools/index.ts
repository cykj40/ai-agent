import { generateImageToolDefinition } from './generateImage'
import { movieSearchToolDefinition } from './movieSearch'
import type { Tool } from '../../types'

export const tools: Tool[] = [
    generateImageToolDefinition,
    movieSearchToolDefinition,
]

