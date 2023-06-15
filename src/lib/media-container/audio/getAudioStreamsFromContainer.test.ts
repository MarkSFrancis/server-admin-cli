import { probeDataFromContainer } from '../probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { type FfprobeData } from 'fluent-ffmpeg'
import { getAudioStreamsFromContainer } from './getAudioStreamsFromContainer'
import { type FfmpegStream } from './types'

jest.mock('../probeStreamsFromContainer')

const probeDataFromContainerMock = jest.mocked(probeDataFromContainer)

beforeEach(() => {
  jest.resetAllMocks()

  probeDataFromContainerMock.mockResolvedValue(
    stub<FfprobeData>({
      streams: [],
    })
  )
})

it('should skip non-audio streams', async () => {
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  })

  probeDataFromContainerMock.mockResolvedValue(testStream)

  const streams = await getAudioStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual<FfmpegStream[]>([])
})

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
  })

  probeDataFromContainerMock.mockResolvedValue(testData)

  const streams = await getAudioStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual<FfmpegStream[]>([
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
