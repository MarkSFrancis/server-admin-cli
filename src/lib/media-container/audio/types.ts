import { type FfprobeStream } from 'fluent-ffmpeg'

export interface FfmpegStream {
  streamContainerPath: string
  stream: FfprobeStream
}
