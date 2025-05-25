import {
  probeDataFromContainer,
  STREAM_TYPES,
} from '../probeStreamsFromContainer';

export const getAudioStreamsFromContainer = async (path: string) => {
  const movieContainer = await probeDataFromContainer(path);

  const allAudioStreams = movieContainer.streams.filter(
    (s) => s.codec_type === STREAM_TYPES.audio
  );
  return allAudioStreams;
};
