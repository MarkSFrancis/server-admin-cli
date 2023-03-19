import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '../probeStreamsFromContainer'
import { type SubtitleStream } from './types'

export const getSubtitleStreamsFromContainer = async (
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
