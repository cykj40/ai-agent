import type { Tool } from '../../types'
import { openai } from '../ai'

const generateImage = async ({ toolArgs }: { toolArgs: { prompt: string } }) => {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: toolArgs.prompt,
            n: 1,
            size: "1024x1024",
        })
        return response.data[0].url || 'Failed to generate image'
    } catch (error) {
        console.error('Image generation error:', error)
        return 'Failed to generate image'
    }
}

export const generateImageToolDefinition: Tool = {
    name: 'generate_image',
    type: 'function',
    function: {
        name: 'generate_image',
        description: 'Generate an image based on a text description',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Detailed description of the image to generate'
                }
            },
            required: ['prompt']
        }
    },
    implementation: generateImage
}

