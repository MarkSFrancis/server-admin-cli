import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '../probeStreamsFromContainer'
import { type FfmpegStream } from './types'

export const getAudioStreamsFromContainer = async (
  path: string
): Promise<FfmpegStream[]> => {
  const movieContainer = await probeDataFromContainer(path)

  const allAudioStreams: FfmpegStream[] = movieContainer.streams
    .filter((s) => s.codec_type === STREAM_TYPES.audio)
    .map((stream) => ({
      streamContainerPath: path,
      stream,
    }))

  return allAudioStreams
}
