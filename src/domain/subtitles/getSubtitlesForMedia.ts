import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { SubtitleStream } from '@/lib/media-container/subtitles/types'
import { getSubtitleStreamsFromContainer } from '@/lib/media-container/subtitles/getSubtitleStreamsFromContainer'

export const getSubtitlesForMedia = async (
  path: string
): Promise<SubtitleStream[]> => {
  const externalSubtitlePaths = await getExternalSubtitlesForMedia(path)

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
