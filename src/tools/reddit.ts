import type { Tool, ToolInput } from '../../types'

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
    implementation: async (input: ToolInput): Promise<string> => {
        // For now, just return a mock response
        return "Here's something interesting from Reddit!"
    }
}
