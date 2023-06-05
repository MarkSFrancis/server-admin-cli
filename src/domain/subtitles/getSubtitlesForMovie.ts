import { getExternalSubtitlesForMovie } from './getExternalSubtitlesForMovie'
import { type SubtitleStream } from '@/lib/media-container/subtitles/types'
import { getSubtitleStreamsFromContainer } from '@/lib/media-container/subtitles/getSubtitleStreamsFromContainer'

export const getSubtitlesForMovie = async (
  path: string
): Promise<SubtitleStream[]> => {
  const externalSubtitlePaths = await getExternalSubtitlesForMovie(path)

  const subtitleFileStreams = await Promise.all([
    getSubtitleStreamsFromContainer(path),
    ...externalSubtitlePaths.map(
      async (p) => await getSubtitleStreamsFromContainer(p)
    ),
  ])

  const subtitleStreams = subtitleFileStreams.reduce(
    (cur, next) => [...cur, ...next],
    []
  )

  return subtitleStreams
}
