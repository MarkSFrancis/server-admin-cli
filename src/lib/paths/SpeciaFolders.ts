import { platform } from 'os'

const pathToShare = osValue({
  default: '/mnt/z',
  darwin: '/Volumes/tank',
})

export const SpecialFolders = {
  Books: `${pathToShare}/media/books/`,
  Clips: `${pathToShare}/media/clips/`,
  Downloads: `${pathToShare}/active-downloads/`,
  Movies: `${pathToShare}/media/movies/`,
  Music: `${pathToShare}/media/music/library/`,
  Pictures: `${pathToShare}/media/pictures/`,
  Tv: `${pathToShare}/media/tv-series`,
}

export type SpecialFolders =
  (typeof SpecialFolders)[keyof typeof SpecialFolders]

function osValue<T>(
  value: Partial<Record<NodeJS.Platform, T>> & { default: T }
) {
  const os = platform()
  if (os in value) {
    return value[os]
  } else {
    return value.default
  }
}
