import { probeDataFromContainer } from '../probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { type FfprobeData } from 'fluent-ffmpeg'
import { getVideoStreamsFromContainer } from './getVideoStreamsFromContainer'

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

it('should skip non-video streams', async () => {
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  })

  probeDataFromContainerMock.mockResolvedValue(testStream)

  const streams = await getVideoStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual([])
})

it('should probe its data and return video streams', async () => {
  const testData = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'video',
      },
      {
        codec_type: 'video',
      },
    ],
  })

  probeDataFromContainerMock.mockResolvedValue(testData)

  const streams = await getVideoStreamsFromContainer('/var/file.mkv')

  expect(streams).toEqual([testData.streams[0], testData.streams[1]])
})
