import { ffprobe, type FfprobeData } from 'fluent-ffmpeg';
import { promisify } from 'util';

const ffprobeAsync = promisify<string, FfprobeData>(ffprobe);

/**
 * The known types used by a stream's `codec_type`
 */
export enum STREAM_TYPES {
  audio = 'audio',
  subtitles = 'subtitle',
  video = 'video',
  data = 'data',
  attachments = 'attachment',
}

export const probeDataFromContainer = async (path: string) => {
  const result = await ffprobeAsync(path);

  return result;
};
