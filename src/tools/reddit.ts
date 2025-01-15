import type { Tool, ToolInput } from '../../types'

export const reddit = async (input: ToolInput) => {
    return "Reddit post content"
}

export const redditToolDefinition: Tool = {
    type: 'function',
    function: {
        name: 'reddit',
        description: 'Get content from Reddit',
        parameters: {
            type: 'object',
            properties: {
                subreddit: {
                    type: 'string',
                    description: 'The subreddit to fetch from'
                }
            },
            required: ['subreddit']
        }
    },
    implementation: reddit
}
