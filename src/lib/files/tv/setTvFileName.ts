import { mkdir, rename } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'
import { getTvSeasonNumber, getTvEpisodeNumber } from './getTvMeta'

export const fixTvEpisodePath = async (path: string) => {
  const seasonNumber = await getTvSeasonNumber(path)
  const episodeNumber = await getTvEpisodeNumber(path)

  const newPath = await getFixedTvEpisodePath(path, {
    seasonNumber,
    episodeNumber,
  })

  await mkdir(dirname(newPath), { recursive: true })
  await rename(path, newPath)

  return newPath
}

export const getFixedTvEpisodePath = async (
  path: string,
  options: { seasonNumber: number; episodeNumber: number }
) => {
  let seasonDir = ''
  let episodeFileName = ''

  const dir = dirname(path)
  const lastDirName = basename(dir)

  const ext = extname(path)

  const formatEpisodeNumber = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  if (options.seasonNumber === 0) {
    seasonDir += 'Specials'
  } else {
    seasonDir += `Season ${options.seasonNumber}`
  }

  if (lastDirName === seasonDir) {
    seasonDir = ''
  }

  if (options.seasonNumber === 0) {
    episodeFileName += 'S00'
  }

  episodeFileName += `E${formatEpisodeNumber(options.episodeNumber)}`

  return join(dir, seasonDir, `${episodeFileName}${ext}`)
}
