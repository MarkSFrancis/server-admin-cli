import {
  type AnimeScheduleAnime,
  getAnime,
  type AnimeScheduleWebsites,
} from '@/lib/apis/animeschedule/getAnime'

export interface GetAnimeEpisodeDatesResultMatch {
  urls: {
    animeSchedule: string
  } & AnimeScheduleWebsites
  title: string
  englishTitle?: string
  description: string
  episodes: number
  earliestSubPremierDate: Date
  earliestDubPremierDate?: Date
  estimatedSubEpisodesAiredSoFar: number
  estimatedDubEpisodesAiredSoFar?: number
  estimatedLastSubEpisodeReleaseDate: Date
  estimatedLastDubEpisodeReleaseDate?: Date
}

export interface GetAnimeEpisodeDatesResult {
  matches: GetAnimeEpisodeDatesResultMatch[]
}

/**
 * Gets the number of completely aired seasons for an anime
 */
export const getAnimeEpisodeDates = async (
  title: string
): Promise<GetAnimeEpisodeDatesResult> => {
  const allAnimeResults = await getAnime(title)

  const matches = allAnimeResults.map<GetAnimeEpisodeDatesResultMatch>((r) => {
    const { subDate, dubDate } = getSubDubPremierDates(r)

    const subEndDate = getEstimatedLastDate(subDate, r.episodes)
    const dubEndDate = dubDate
      ? getEstimatedLastDate(dubDate, r.episodes)
      : undefined

    const subAiredSoFar = getEstimatedEpisodesAiredSoFar(subDate, r.episodes)
    const dubAiredSoFar = dubDate
      ? getEstimatedEpisodesAiredSoFar(dubDate, r.episodes)
      : undefined

    return {
      urls: {
        animeSchedule: `https://animeschedule.net/anime/${r.route}`,
        ...websitesToUrls(r.websites),
      },
      title: r.title,
      englishTitle: r.names.english,
      description: r.description,
      episodes: r.episodes,
      earliestSubPremierDate: subDate,
      earliestDubPremierDate: dubDate,
      estimatedSubEpisodesAiredSoFar: subAiredSoFar,
      estimatedDubEpisodesAiredSoFar: dubAiredSoFar,
      estimatedLastSubEpisodeReleaseDate: subEndDate,
      estimatedLastDubEpisodeReleaseDate: dubEndDate,
    }
  })

  return {
    matches,
  }
}

const getSubDubPremierDates = (anime: AnimeScheduleAnime) => {
  function isValidDate(date?: Date) {
    if (!date || isNaN(+date) || date.getUTCFullYear() === 1) {
      return false
    }

    return true
  }

  const subDate = new Date(anime.premier)

  let dubDate = anime.dubPremier ? new Date(anime.dubPremier) : undefined

  if (!isValidDate(dubDate)) {
    dubDate = undefined
  }

  return {
    subDate,
    dubDate,
  }
}

const getEstimatedLastDate = (premierDate: Date, episodeCount: number) => {
  const lastDate = new Date(premierDate)

  const weeksToAirAllEpisodes = episodeCount - 1

  lastDate.setDate(lastDate.getDate() + weeksToAirAllEpisodes * 7)

  return lastDate
}

const getEstimatedEpisodesAiredSoFar = (
  premierDate: Date,
  episodeCount: number
) => {
  const now = new Date()

  const timeSincePremierMs = +now - +premierDate

  const weeksSincePremier = timeSincePremierMs / (1000 * 60 * 60 * 24 * 7)

  return Math.min(Math.floor(weeksSincePremier) + 1, episodeCount)
}

const websitesToUrls = (websites: AnimeScheduleWebsites) => {
  const prepend = (url: string) => {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = `https://${url}`
    }

    return url
  }

  const withPrefix = Object.entries(websites).reduce<AnimeScheduleWebsites>(
    (mapped, [key, value]) => {
      return {
        ...mapped,
        [key]: prepend(value),
      }
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as unknown as AnimeScheduleWebsites
  )

  return withPrefix
}
