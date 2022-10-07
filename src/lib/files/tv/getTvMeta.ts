import { basename } from 'path'
import { askUserForInput } from '../../console'
import { distinct } from '../../distinct'

export const getTvSeasonNumber = async (path: string): Promise<number> => {
  const seasonPattern = /(S\d+)|(Season \d+)|(Specials)/gi

  const results = [...path.matchAll(seasonPattern)]

  let seasonNumber: number = -1

  const possibleSeasonNumbers = results
    .map((r) => {
      const specialSeasonName = 'specials'
      const longSeasonName = 'season '
      const shortSeasonName = 's'
      const matchText = r[0]
      const normalizedMatchText = r[0].toLowerCase()

      if (normalizedMatchText.startsWith(longSeasonName)) {
        return matchText.substring(longSeasonName.length)
      } else if (normalizedMatchText.includes(specialSeasonName)) {
        return '0'
      } else {
        return matchText.substring(shortSeasonName.length)
      }
    })
    .map((r) => Number(r))
    .reduce<number[]>(distinct, [])

  if (possibleSeasonNumbers.length === 1) {
    seasonNumber = possibleSeasonNumbers[0]
  }

  while (seasonNumber < 0 || !Number.isInteger(seasonNumber)) {
    console.log({ results })
    const seasonNumberText = await askUserForInput(
      `Could not auto-detect season for ${basename(
        path
      )}. Please enter it manually: `
    )

    seasonNumber = Number(seasonNumberText)
  }

  return seasonNumber
}

export const getTvEpisodeNumber = async (path: string): Promise<number> => {
  const name = basename(path)

  const episodePattern = /(E\d+)|(Episode \d+)/gi

  const results = [...name.matchAll(episodePattern)]

  let episodeNumber: number = 0

  const possibleEpisodeNumbers = results
    .map((r) => {
      const longEpisodeName = 'Episode '
      const shortEpisodeName = 'E'
      if (r[0].startsWith(longEpisodeName)) {
        return r[0].substring(longEpisodeName.length)
      } else {
        return r[0].substring(shortEpisodeName.length)
      }
    })
    .map((r) => Number(r))
    .reduce<number[]>(distinct, [])

  if (possibleEpisodeNumbers.length === 1) {
    episodeNumber = possibleEpisodeNumbers[0]
  }

  while (episodeNumber <= 0 || !Number.isInteger(episodeNumber)) {
    console.log({ results })
    const episodeNumberText = await askUserForInput(
      `Could not auto-detect episode for ${name}. Please enter it manually: `
    )

    episodeNumber = Number(episodeNumberText)
  }

  return episodeNumber
}
