import type { Tool } from '../../types'
import { queryMovies } from '../rag/query'

const movieSearch = async ({ toolArgs }: { toolArgs: { query: string } }) => {
    try {
        const results = await queryMovies(toolArgs.query)
        return JSON.stringify(results, null, 2)
    } catch (error) {
        console.error('Movie search error:', error)
        return 'Failed to search for movies'
    }
}

export const movieSearchToolDefinition: Tool = {
    name: 'search_movies',
    type: 'function',
    function: {
        name: 'search_movies',
        description: 'Search for movies in the database to get information about them',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query for finding movies'
                }
            },
            required: ['query']
        }
    },
    implementation: movieSearch
}
