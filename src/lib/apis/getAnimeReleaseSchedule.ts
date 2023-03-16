import axios from 'axios'

// API docs: https://anilist.github.io/ApiV2-GraphQL-Docs/
// API playground: https://anilist.co/graphiql

/**
 * Does not support dub schedule
 */
export const getAnimeReleaseSchedule = async (searchTerm: string) => {
  const query = `
    query ($query: String) {
      Media(type:ANIME, search: $query) {
        id,
        siteUrl,
        title {
          english
        },
        episodes,
        startDate {
          year
          month
          day
        }
        airingSchedule {
          edges {
            node {
              episode,
              airingAt
            }
          }
        }
      }
    }
`

  const variables = {
    query: searchTerm,
  }

  const results = await axios.post<{
    data: {
      Media: {
        id: number
        siteUrl: string
        title: { english: string }
        episodes: number
        startDate: { year: number; month: number; day: number }
        airingSchedule: {
          edges: { node: { episode: number; airingAt: number } }[]
        }
      }
    }
  }>(
    'https://graphql.anilist.co',
    {
      query,
      variables,
    },
    {
      validateStatus: (_status) => true,
    }
  )

  if (results.status < 200 || results.status >= 300) {
    const err = results.data as unknown as {
      errors: {
        message: string
        status: number
        locations: {
          line: number
          column: number
        }[]
      }[]
      data: null
    }

    throw new Error(JSON.stringify(err.errors))
  }

  return results.data.data.Media
}
