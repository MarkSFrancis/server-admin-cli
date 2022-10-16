import { FfprobeStream } from 'fluent-ffmpeg'
import { getStreamLanguage } from '../getStreamLanguage'

export interface SubtitleMetadata {
  title?: string
  codec?: string
  default?: boolean
  forced?: boolean
  /**
   * For the purposes of this metadata parser, I'm treating closed captions as synonymous to subtitles for the deaf and hard of hearing
   */
  closedCaptions?: boolean
  language?: string
}

export const getSubtitleMetadataFromStream = (
  stream: FfprobeStream
): SubtitleMetadata => {
  const language = getStreamLanguage(stream)

  return {
    language,
    default: isSet(stream.disposition?.default),
    closedCaptions: isSet(stream.disposition?.hearing_impaired),
    forced: isSet(stream?.disposition?.forced),
    title: stream.tags?.title,
    codec: stream.codec_name,
  }
}

const isSet = (value: number | undefined): boolean | undefined => {
  if (value === undefined) return undefined

  return value === 1
}
