import { ffprobe, FfprobeData } from 'fluent-ffmpeg'
import { promisify } from 'util'

const ffprobeAsync = promisify<string, FfprobeData>(ffprobe)

export enum STREAM_TYPES {
  audio = 'audio',
  subtitles = 'subtitles',
  video = 'video',
  data = 'data',
  attachments = 'attachments',
}

export const probeStreamsFromContainer = async (path: string) => {
  const result = await ffprobeAsync(path)

  return result
}
