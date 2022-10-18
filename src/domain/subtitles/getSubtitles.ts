import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getSubtitleStreamsFromContainer } from './getSubtitleStreamsFromContainer'
import { SubtitleStream } from './types'

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
