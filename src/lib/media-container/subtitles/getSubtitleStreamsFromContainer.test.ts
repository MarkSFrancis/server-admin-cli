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
      subtitles: 'subtitle',
    },
  },
});

const { getSubtitleStreamsFromContainer } = await import(
  './getSubtitleStreamsFromContainer'
);

beforeEach(() => {
  probeDataFromContainerMock.mock.resetCalls();

  probeDataFromContainerMock.mock.mockImplementation(async () =>
    stub<FfprobeData>({
      streams: [],
    })
  );
});

it('should skip non-subtitle streams', async () => {
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  });

  probeDataFromContainerMock.mock.mockImplementation(async () => testStream);

  const streams = await getSubtitleStreamsFromContainer('/var/file.mkv');

  assert.deepStrictEqual(streams, []);
});

it('should probe its data and return subtitle streams', async () => {
  const testData = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'subtitle',
      },
      {
        codec_type: 'subtitle',
      },
    ],
  });

  probeDataFromContainerMock.mock.mockImplementation(async () => testData);

  const streams = await getSubtitleStreamsFromContainer('/var/file.mkv');

  assert.deepStrictEqual(streams, [testData.streams[0], testData.streams[1]]);
});
