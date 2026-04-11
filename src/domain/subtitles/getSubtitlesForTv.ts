import { getSubtitleStreamsFromContainer } from '#/lib/media-container/subtitles/getSubtitleStreamsFromContainer.ts';
import { getExternalSubtitlesForTv } from './getExternalSubtitlesForTv.ts';

export const getSubtitlesForTv = async (path: string) => {
  const externalSubtitlePaths = await getExternalSubtitlesForTv(path);

  const subtitleFileStreams = await Promise.all([
    getSubtitleStreamsFromContainer(path).then((streams) =>
      streams.map((stream) => ({
        streamContainerPath: path,
        stream,
      }))
    ),
    ...externalSubtitlePaths.map(
      async (p) =>
        await getSubtitleStreamsFromContainer(p).then((streams) =>
          streams.map((stream) => ({
            streamContainerPath: p,
            stream: stream,
          }))
        )
    ),
  ]);

  const subtitleStreams = subtitleFileStreams.reduce(
    (cur, next) => [...cur, ...next],
    []
  );

  return subtitleStreams;
};
