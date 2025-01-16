import type { Tool, ToolFn } from '../../types'
import { z } from 'zod'
import { openai } from '../ai'

const parameters = z.object({
    prompt: z
        .string()
        .describe(
            `prompt for the image. Be sure to consider the user's original message when making the prompt. If you are unsure, then as the user to provide more details.`
        ),
})

type Args = z.infer<typeof parameters>

export const generateImage: ToolFn<Args, string> = async ({
    toolArgs,
    userMessage,
}: {
    toolArgs: Args;
    userMessage: string;
}) => {
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: toolArgs.prompt,
        n: 1,
        size: '1024x1024',
    })

    return response.data[0].url!
}

export const generateImageToolDefinition: Tool = {
    type: 'function',
    function: {
        name: 'generate_image',
        description: 'Generate an image based on a text description',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: parameters.shape.prompt.description,
                }
            },
            required: ['prompt']
        }
    },
    implementation: generateImage
}

