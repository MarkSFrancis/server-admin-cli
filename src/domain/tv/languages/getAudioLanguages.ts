import { getAudioStreamsFromContainer } from '#/lib/media-container/audio/getAudioStreamsFromContainer.ts';
import { getStreamLanguage } from '#/lib/media-container/getStreamLanguage.ts';
import { type FfprobeStream } from 'fluent-ffmpeg';

export const getAudioLanguages = async (path: string) => {
  const streams = await getAudioStreamsFromContainer(path);

  const languages = streams.map((s) =>
    getStreamLanguage(s.stream as FfprobeStream)
  );

  return languages;
};
