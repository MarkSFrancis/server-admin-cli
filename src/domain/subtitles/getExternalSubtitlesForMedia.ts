import { resolveGlob } from '@/lib/fs/glob/resolveGlob'
import { getExternalSubtitlesGlobs } from './getExternalSubtitlesGlobs'

export const getExternalSubtitlesForMedia = async (
  path: string
): Promise<string[]> => {
  const globs = getExternalSubtitlesGlobs(path)

  const externalSubtitlesPaths = await Promise.all(
    globs.map(async (g) => await resolveGlob(g))
  ).then((r) => r.reduce((cur, next) => [...cur, ...next]))

  return externalSubtitlesPaths
}
