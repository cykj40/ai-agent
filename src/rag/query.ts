import { Index as UpstashIndex } from '@upstash/vector'

const index = new UpstashIndex({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

type MovieMetaData = {
    title?: string
    year?: number
    genre?: string
    director?: string
    actor?: string
    rating?: number
    votes?: number
    revenue?: number
    metascore?: number
}

export const queryMovies = async (
    query: string,
    filters?: Partial<MovieMetaData>,
    topK: number = 5
) => {
    // Build filter string if filters provided
    let filterStr = ''
    if (filters) {
        const filterParts = Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}='${value}'`)

        if (filterParts.length > 0) {
            filterStr = filterParts.join(' AND ')
        }
    }

    // Query the vector store
    const results = await index.query({
        data: query,
        topK,
        filter: filterStr || undefined,
        includeMetadata: true,
        includeData: true,
    })

    return results
}
