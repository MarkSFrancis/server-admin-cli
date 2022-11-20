import { basename } from 'path'
import { promptForInput } from '../../console/promptForInput'
import { distinct } from '../../distinct'

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
    const episodeNumberText = await promptForInput(
      `Could not auto-detect episode for ${name}. Please enter it manually: `
    )

    episodeNumber = Number(episodeNumberText)
  }

  return episodeNumber
}
