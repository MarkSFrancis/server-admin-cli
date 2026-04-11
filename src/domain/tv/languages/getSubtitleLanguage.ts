import { getExternalSubtitlesForTv } from '#/domain/subtitles/getExternalSubtitlesForTv.ts';
import { getStreamLanguage } from '#/lib/media-container/getStreamLanguage.ts';
import { getSubtitleStreamsFromContainer } from '#/lib/media-container/subtitles/getSubtitleStreamsFromContainer.ts';
import { getSubtitleMetadataFromPath } from '#/lib/paths/subtitles/getSubtitleMetadataFromPath.ts';
import { type FfprobeStream } from 'fluent-ffmpeg';

export const getSubtitleLanguages = async (path: string) => {
  const streams = await getSubtitleStreamsFromContainer(path);

  const internal = streams.map((s) =>
    getStreamLanguage(s.stream as FfprobeStream)
  );

  const externalSubtitles = await getExternalSubtitlesForTv(path);

  const external = externalSubtitles
    .map((subPath) => getSubtitleMetadataFromPath(subPath))
    .map((s) => s.language)
    .filter((s): s is string => !!s);

  return {
    internal,
    external,
  };
};
