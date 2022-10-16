import { resolveGlob } from '@/lib/fs/crawler'
import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '@/lib/media-container/probeStreamsFromContainer'
import { SUBTITLE_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { extname } from 'path'
import { SubtitleStream } from './types'

export const getExternalSubtitlesForMedia = async (
  path: string
): Promise<SubtitleStream[]> => {
  const glob = getExternalSubtitlesGlob(path)

  const externalSubtitlesPaths = await resolveGlob(glob)

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

export const getExternalSubtitlesGlob = (path: string): string => {
  const pathExt = extname(path)
  const pathWithoutExt = path.substring(0, path.length - pathExt.length)

  const subtitlesGlob = `${pathWithoutExt}*(${SUBTITLE_FILE_EXTENSIONS.join(
    '|'
  )})`

  return subtitlesGlob
}
