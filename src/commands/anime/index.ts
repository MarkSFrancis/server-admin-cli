import { Argument, Command } from 'commander'
import { getAnimeEpisodeDates } from '@/domain/anime/getAnimeEpisodeDates'

export const animeCommand = new Command('anime')
  .addArgument(
    new Argument('<searchTerm>', 'The name of the anime to get episodes for')
  )
  .action(async (searchTerm: string) => {
    console.info(`Querying for episodes for the show ${searchTerm}...`)

    const results = await getAnimeEpisodeDates(searchTerm)

    for (const match of results.matches) {
      console.info({
        title: match.englishTitle ?? match.title,
        urls: match.urls,
        subs: {
          isReleased: match.episodes === match.estimatedSubEpisodesAiredSoFar,
          estimatedReleaseDate: match.estimatedLastSubEpisodeReleaseDate,
          estimatedReleasedEpisodes: match.estimatedSubEpisodesAiredSoFar,
        },
        dubs: !!match.earliestDubPremierDate && {
          isReleased: match.episodes === match.estimatedDubEpisodesAiredSoFar,
          estimatedReleaseDate: match.estimatedLastDubEpisodeReleaseDate,
          estimatedReleasedEpisodes: match.estimatedDubEpisodesAiredSoFar,
        },
      })
    }
  })
