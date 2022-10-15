import { FfprobeStream } from 'fluent-ffmpeg'
import { getStreamLanguage } from '../getStreamLanguage'

export interface SubtitleStreamMetadataState {
  default?: boolean
  forced?: boolean
  /**
   * For the purposes of this metadata parser, I'm treating closed captions as synonymous to subtitles for the deaf and hard of hearing
   */
  closedCaptions?: boolean
  language?: string
}

export interface SubtitleStreamMetadata {
  currentState: SubtitleStreamMetadataState
  stateEstimatedAsShouldBe: SubtitleStreamMetadataState
}

export const getSubtitleStreamMetadata = (
  stream: FfprobeStream
): SubtitleStreamMetadata => {
  const language = getStreamLanguage(stream)

  return {
    currentState: {
      language,
      default: isSet(stream.disposition?.default),
      closedCaptions: isSet(stream.disposition?.hearing_impaired),
      forced: isSet(stream?.disposition?.forced),
    },
    stateEstimatedAsShouldBe: {
      // TODO: Should probably actually do something smart here
      language,
      default: isSet(stream.disposition?.default),
      closedCaptions: isSet(stream.disposition?.hearing_impaired),
      forced: isSet(stream?.disposition?.forced),
    },
  }
}

const isSet = (value: number | undefined): boolean | undefined => {
  if (value === undefined) return undefined

  return value === 1
}
