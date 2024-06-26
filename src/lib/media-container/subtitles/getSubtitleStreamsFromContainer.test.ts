import { probeDataFromContainer } from '../probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { type FfprobeData } from 'fluent-ffmpeg'
import { getSubtitleStreamsFromContainer } from './getSubtitleStreamsFromContainer'

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

  expect(streams).toEqual([])
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

  expect(streams).toEqual([testData.streams[0], testData.streams[1]])
})
