import { resolveGlob } from '@/lib/fs/glob/resolveGlob'
import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '@/lib/media-container/probeStreamsFromContainer'
import { getExternalSubtitlesGlobs } from './getExternalSubtitlesGlobs'
import { SubtitleStream } from './types'

export const getExternalSubtitlesForMedia = async (
  path: string
): Promise<SubtitleStream[]> => {
  const globs = getExternalSubtitlesGlobs(path)

  const externalSubtitlesPaths = await Promise.all(
    globs.map(async (g) => await resolveGlob(g))
  ).then((r) => r.reduce((cur, next) => [...cur, ...next]))

  const allSubtitleStreams: SubtitleStream[] = []

  for (const subtitlesContainerPath of externalSubtitlesPaths) {
    const subtitlesContainer = await probeDataFromContainer(
      subtitlesContainerPath
    )
    allSubtitleStreams.push(
      ...subtitlesContainer.streams
        .filter((s) => s.codec_type === STREAM_TYPES.subtitles)
        .map((stream) => ({
          streamContainerPath: subtitlesContainerPath,
          stream,
        }))
    )
  }

  return allSubtitleStreams
}
