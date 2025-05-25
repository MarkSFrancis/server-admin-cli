import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '../probeStreamsFromContainer';

export const getVideoStreamsFromContainer = async (path: string) => {
  const movieContainer = await probeDataFromContainer(path);

  const allVideoStreams = movieContainer.streams.filter(
    (s) => s.codec_type === STREAM_TYPES.video
  );

  return allVideoStreams;
};
