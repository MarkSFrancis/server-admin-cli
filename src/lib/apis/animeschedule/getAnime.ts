import axios from 'axios'

// API docs:
// https://animeschedule.net/api/v3/documentation/anime

interface AnimeScheduleAnimePagination {
  page: number
  totalAmount: number
  anime: AnimeScheduleAnime[]
}

export interface AnimeScheduleAnime {
  /**
   * The unique ID.
   */
  id: string
  /**
   * The title. Separate from other names and used as a high-priority name in some cases.
   */
  title: string
  /**
   * The unique URL slug.
   */
  route: string
  /**
   * The _Japanese_ release date of the first episode.
   */
  premier: string
  /**
   * The _English Sub_ release date of the first episode.
   */
  subPremier: string | null
  /**
   * The _English Dub_ release date of the first episode.
   */
  dubPremier: string | null
  /**
   * The earliest month of an anime's release date.
   */
  month: string
  /**
   * The earliest year of an anime's release date.
   */
  year: number
  /**
   * The calendar season.
   */
  season: AnimeScheduleSeason
  /**
   * The delayed text on the timetable.
   */
  delayedTimetable: string | null
  /**
   * The date from which it has been delayed.
   */
  delayedFrom: string
  /**
   * The date until it has been delayed to.
   */
  delayedUntil: string
  /**
   * The sub delayed text on the timetable. Used only if `SubPremier` is not null.
   */
  subDelayedTimetable: string
  /**
   * The date from which the sub has been delayed. Used only if `SubPremier` is not null.
   */
  subDelayedFrom: string
  /**
   * The date until it the sub has been delayed to. Used only if `SubPremier` is not null.
   */
  subDelayedUntil: string
  /**
   * The dub delayed text on the timetable. Used only if `DubPremier` is not null.
   */
  dubDelayedTimetable: string
  /**
   * The date from which the dub has been delayed from. Used only if `DubPremier` is not null.
   */
  dubDelayedFrom: string
  /**
   * The date until it the dub has been delayed to. Used only if `DubPremier` is not null.
   */
  dubDelayedUntil: string
  /**
   * The delayed description text on the anime's page.
   */
  delayedDesc: string | null
  /**
   * The _Japanese_ release time. Only the hour and minute are relevant.
   */
  jpnTime: string
  /**
   * The _English Sub_ release time. Only the hour and minute are relevant.
   */
  subTime: string | null
  /**
   * The _English Dub_ release time. Only the hour and minute are relevant.
   */
  dubTime: string | null
  /**
   * The description.
   */
  description: string
  /**
   * The anime's genres in an array of the category object.
   */
  genres: AnimeScheduleCategory[]
  /**
   * The anime's studios in an array of the category object.
   */
  studios: AnimeScheduleCategory[]
  /**
   * The anime's sources in an array of the category object.
   */
  sources: AnimeScheduleCategory[]
  /**
   * The anime's media types in an array of the category object.
   */
  mediaTypes: AnimeScheduleCategory[]
  /**
   * The number of episodes.
   */
  episodes: number
  /**
   * The length per episode in minutes.
   */
  lengthMin: number
  /**
   * The airing status.
   */
  status: string
  /**
   * The anime's poster/image URL slug.
   */
  imageVersionRoute: string
  /**
   * The anime's statistics.
   */
  stats: AnimeScheduleStats
  /**
   * Whether an anime airs multiple times a week and which days specifically. Used only if it airs multiple times a week.
   */
  days: AnimeScheduleDays | null
  /**
   * The anime's names.
   */
  names: AnimeScheduleNames
  /**
   * All related anime. The strings represent their route/slug.
   */
  relations: AnimeScheduleRelations
  /**
   * The anime's websites.
   */
  websites: AnimeScheduleWebsites
}

export interface AnimeScheduleCategory {
  /**
   * The name of the category.
   * @example 'Fantasy' | 'Trigger' | 'Manga' | 'TV'
   */
  name: string
  /**
   * The unique URL slug.
   * @example 'martial-arts' | 'a-1-pictures' | 'light-novel' | 'tv-short'
   */
  route: string
}

/**
 * Whether an anime airs multiple times a week and which days specifically. Used **only** if it airs multiple times a week.
 */
export interface AnimeScheduleDays {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface AnimeScheduleNames {
  romaji: string
  english: string
  native: string
  abbreviation: string
  synonyms: string[]
}

/**
 * All related anime. The strings represent their route/slug.
 */
export interface AnimeScheduleRelations {
  sequels: string[]
  prequels: string[]
  parents: string[]
  alternatives: string[]
  other: string[]
  sideStories: string[]
  spinoffs: string[]
}

export interface AnimeScheduleSeason {
  /**
   * The display title.
   */
  title: string
  /**
   * The year the season is in.
   */
  year: number
  /**
   * The calendar season.
   */
  season: string
  /**
   * The unique URL slug, consisting of the calendar season and the year.
   */
  route: string
}

export interface AnimeScheduleStats {
  /**
   * The average score from 1 to a 100. The score is weighted with the formula `ratingCount/(ratingCount+5)*ratingSum/ratingCount+(5/(ratingCount+5))*mean`. Mean is the average score across all anime.
   * @example `5` `68.753` `97.1`
   */
  averageScore: number
  /**
   * How many users have rated/scored.
   */
  ratingCount: number
  /**
   * How many users have it in their anime list.
   */
  trackedCount: number
  /**
   * Popularity rating compared to all other anime.
   */
  trackedRating: number
  /**
   * The HEX color value for Average Score's color in default theme mode.
   */
  colorLightMode: string
  /**
   * The HEX color value for Average Score's color in dark theme mode.
   */
  colorDarkMode: string
}

export interface AnimeScheduleWebsites {
  official: string | null
  mal: string | null
  aniList: string | null
  kitsu: string | null
  animePlanet: string | null
  anidb: string | null
  crunchyroll: string | null
  funimation: string | null
  wakanim: string | null
  amazon: string | null
  hidive: string | null
  hulu: string | null
  vrv: string | null
  youtube: string | null
  netflix: string | null
}

export const getAnime = async (searchTerm: string) => {
  const query = new URLSearchParams({
    q: searchTerm,
  })

  const response = await axios.get<AnimeScheduleAnimePagination>(
    `https://animeschedule.net/api/v3/anime?${query.toString()}`
  )

  if (response.data.anime.length < response.data.totalAmount) {
    console.warn(
      `${response.data.totalAmount} results detected. Filtering to the top ${response.data.anime.length} results`
    )
  }

  return response.data.anime
}
