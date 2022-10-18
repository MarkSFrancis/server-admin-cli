import { FfprobeStream } from 'fluent-ffmpeg'

export interface SubtitleStream {
  streamContainerPath: string
  stream: FfprobeStream
}
