import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '../probeStreamsFromContainer'

export const getSubtitleStreamsFromContainer = async (path: string) => {
  const movieContainer = await probeDataFromContainer(path)

  const allSubtitleStreams = movieContainer.streams.filter(
    (s) => s.codec_type === STREAM_TYPES.subtitles
  )

  return allSubtitleStreams
}
