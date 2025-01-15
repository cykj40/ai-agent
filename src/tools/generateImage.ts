import type { Tool, ToolInput } from '../../types'
import { openai } from '../ai'

export const generateImage = async (input: ToolInput) => {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: input.toolArgs.prompt,
        n: 1,
        size: "1024x1024",
    })
    return response.data[0].url
}

export const generateImageToolDefinition: Tool = {
    type: 'function',
    function: {
        name: 'generateImage',
        description: 'Generate an image using DALL-E based on a text description',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'The description of the image to generate'
                }
            },
            required: ['prompt']
        }
    },
    implementation: generateImage
}

