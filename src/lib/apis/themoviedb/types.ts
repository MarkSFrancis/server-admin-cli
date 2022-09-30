export type TmdbTvSearchResponse = TmdbPaginator<TmdbTvSeries>

export interface TmdbTvSeries {
  backdrop_path: string
  first_air_date: string
  genre_ids: number[]
  id: number
  name: string
  origin_country: string
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  vote_average: string
  vote_count: string
}

export interface TmdbPaginator<T> {
  page: number
  total_pages: number
  total_results: number
  results: T[]
}
