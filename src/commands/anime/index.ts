import { Argument, Command } from 'commander'
import { getAnimeReleaseSchedule } from '@/lib/apis/getAnimeReleaseSchedule'

// API docs: https://anilist.github.io/ApiV2-GraphQL-Docs/
// API playground: https://anilist.co/graphiql

export const animeCommand = new Command('anime')
  .addArgument(
    new Argument('<searchTerm>', 'The name of the anime to get episodes for')
  )
  .action(async (searchTerm: string) => {
    console.info(`Querying for episodes for the show ${searchTerm}...`)

    const results = await getAnimeReleaseSchedule(searchTerm)

    const totalEpisodes = results.episodes
    const schedule = results.airingSchedule.edges.map((e) => ({
      episode: e.node.episode,
      releaseDate: new Date(e.node.airingAt * 1000),
    }))

    const now = new Date()

    const releasedEpisodes = schedule.filter((s) => s.releaseDate < now)
    const unreleasedEpisodes = schedule.filter((s) => s.releaseDate >= now)

    console.info({
      title: results.title,
      url: results.siteUrl,
      totalEpisodes,
      isReleased: releasedEpisodes.length === totalEpisodes,
      unreleasedEpisodes,
      releasedEpisodes,
    })
  })
