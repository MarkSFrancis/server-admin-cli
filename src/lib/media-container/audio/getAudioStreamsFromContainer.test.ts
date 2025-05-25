import { probeDataFromContainer } from '../probeStreamsFromContainer';
import { stub } from '@/lib/test-utils/stub';
import { type FfprobeData } from 'fluent-ffmpeg';
import { mock, beforeEach, it } from 'node:test';
import assert from 'node:assert';

const probeDataFromContainerMock = mock.fn<typeof probeDataFromContainer>();
mock.module('../probeStreamsFromContainer', {
  namedExports: {
    probeDataFromContainer: probeDataFromContainerMock,
    STREAM_TYPES: {
      audio: 'audio',
    },
  },
});

const { getAudioStreamsFromContainer } = await import(
  './getAudioStreamsFromContainer'
);

beforeEach(() => {
  probeDataFromContainerMock.mock.resetCalls();

  probeDataFromContainerMock.mock.mockImplementation(async () =>
    stub<FfprobeData>({
      streams: [],
    })
  );
});

it('should skip non-audio streams', async () => {
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  });

  probeDataFromContainerMock.mock.mockImplementation(async () => testStream);

  const streams = await getAudioStreamsFromContainer('/var/file.mkv');

  assert.deepStrictEqual(streams, []);
});

it('should probe its data and return audio streams', async () => {
  const testData = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'audio',
      },
      {
        codec_type: 'audio',
      },
    ],
  });

  probeDataFromContainerMock.mock.mockImplementation(async () => testData);

  const streams = await getAudioStreamsFromContainer('/var/file.mkv');

  assert.deepStrictEqual(streams, [testData.streams[0], testData.streams[1]]);
});
