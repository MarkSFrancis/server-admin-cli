import { probeDataFromContainer } from '@/lib/media-container/probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { FfprobeData } from 'fluent-ffmpeg'
import { getSubtitleStreamsFromContainer } from './getSubtitleStreamsFromContainer'
import { SubtitleStream } from './types'

jest.mock('@/lib/media-container/probeStreamsFromContainer')

const probeDataFromContainerMock = jest.mocked(probeDataFromContainer)

beforeEach(() => {
  jest.resetAllMocks()

  probeDataFromContainerMock.mockResolvedValue(
    stub<FfprobeData>({
      streams: [],
    })
  )
})

it('should skip non-subtitle streams', async () => {
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  })

  probeDataFromContainerMock.mockResolvedValue(testStream)

  const streams = await getSubtitleStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual<SubtitleStream[]>([])
})

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
  })

  probeDataFromContainerMock.mockResolvedValue(testData)

  const streams = await getSubtitleStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual<SubtitleStream[]>([
    {
      streamContainerPath: '/var/file.mkv',
      stream: testData.streams[0],
    },
    {
      streamContainerPath: '/var/file.mkv',
      stream: testData.streams[1],
    },
  ])
})
