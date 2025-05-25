import { getExternalSubtitlesForMovie } from './getExternalSubtitlesForMovie';
import { getSubtitleStreamsFromContainer } from '@/lib/media-container/subtitles/getSubtitleStreamsFromContainer';

export const getSubtitlesForMovie = async (path: string) => {
  const externalSubtitlePaths = await getExternalSubtitlesForMovie(path);

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
            streamContainerPath: path,
            stream,
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
