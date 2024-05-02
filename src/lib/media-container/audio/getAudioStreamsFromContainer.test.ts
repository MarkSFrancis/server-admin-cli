import { probeDataFromContainer } from '../probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { FfprobeStream, type FfprobeData } from 'fluent-ffmpeg'
import { getAudioStreamsFromContainer } from './getAudioStreamsFromContainer'

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

  expect(streams).toEqual([])
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

  expect(streams).toEqual<FfprobeStream[]>([
    testData.streams[0],
    testData.streams[1],
  ])
})
