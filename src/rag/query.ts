import { Index } from '@upstash/vector'
import { openai } from '../ai'

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

export async function queryMovies(query: string) {
    try {
        // Get embeddings for the query
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
            dimensions: 1024
        })
        const embedding = response.data[0].embedding

        // Search for similar movies
        const results = await index.query({
            vector: embedding,
            topK: 5,
            includeMetadata: true,
        })

        return results.map(result => ({
            title: result.metadata?.title,
            year: result.metadata?.year,
            genre: result.metadata?.genre,
            director: result.metadata?.director,
            actors: result.metadata?.actors,
            rating: result.metadata?.rating,
            score: result.score,
        }))
    } catch (error) {
        console.error('Failed to query movies:', error)
        throw error
    }
}
