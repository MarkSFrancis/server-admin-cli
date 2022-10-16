import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '@/lib/media-container/probeStreamsFromContainer'
import { SubtitleStream } from './types'

export const getInternalSubtitlesFromContainer = async (
  path: string
): Promise<SubtitleStream[]> => {
  const movieContainer = await probeDataFromContainer(path)

  const allSubtitleStreams: SubtitleStream[] = movieContainer.streams
    .filter((s) => s.codec_type === STREAM_TYPES.subtitles)
    .map((stream) => ({
      streamContainerPath: path,
      stream,
    }))

  return allSubtitleStreams
}
