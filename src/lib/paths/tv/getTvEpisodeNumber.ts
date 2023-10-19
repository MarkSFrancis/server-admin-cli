import { basename, extname } from 'path'
import { promptForInput } from '../../console/promptForInput'
import { distinct } from '../../distinct'

export const getTvEpisodeNumber = async (path: string): Promise<number> => {
  const name = basename(path, extname(path))

  const episodePattern =
    /( - \d+( |\)|$))|((\(| |-|^)E\d+)|(Episode \d+)|(E\d+(\)| |-|$))/gi

  const results = [...name.matchAll(episodePattern)]

  let episodeNumber = 0

  const possibleEpisodeNumbers = results
    .map((r) => {
      const results = r[0].match(/\d+/) as [string]
      return results[0]
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
