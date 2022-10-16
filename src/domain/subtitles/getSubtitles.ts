import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getInternalSubtitlesFromContainer } from './getInternalSubtitlesFromContainer'
import { SubtitleStream } from './types'

export const getSubtitlesForMedia = async (
  path: string
): Promise<SubtitleStream[]> => {
  const internalSubtitleStreams = await getInternalSubtitlesFromContainer(path)

  const externalSubtitleStreams = await getExternalSubtitlesForMedia(path)

  return [...internalSubtitleStreams, ...externalSubtitleStreams]
}
