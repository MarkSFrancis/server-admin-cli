import { resolveGlob } from '@/lib/fs/glob/resolveGlob'
import { probeDataFromContainer } from '@/lib/media-container/probeStreamsFromContainer'
import { stub } from '@/lib/test-utils/stub'
import { FfprobeData } from 'fluent-ffmpeg'
import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getExternalSubtitlesGlobs } from './getExternalSubtitlesGlobs'
import { SubtitleStream } from './types'

jest.mock('./getExternalSubtitlesGlob')
jest.mock('@/lib/fs/glob/resolveGlob')
jest.mock('@/lib/media-container/probeStreamsFromContainer')

const getExternalSubtitlesGlobMock = jest.mocked(getExternalSubtitlesGlobs)
const resolveGlobMock = jest.mocked(resolveGlob)
const probeDataFromContainerMock = jest.mocked(probeDataFromContainer)

beforeEach(() => {
  jest.resetAllMocks()

  getExternalSubtitlesGlobMock.mockReturnValue('test-glob')
  resolveGlobMock.mockResolvedValue([])
  probeDataFromContainerMock.mockResolvedValue(
    stub<FfprobeData>({
      streams: [],
    })
  )
})

it('should get and execute glob', async () => {
  getExternalSubtitlesGlobMock.mockReturnValue('file-glob')

  await getExternalSubtitlesForMedia('/var/file.mkv')

  expect(getExternalSubtitlesGlobMock).toHaveBeenCalledWith('/var/file.mkv')
  expect(resolveGlobMock).toHaveBeenCalledWith('file-glob')
})

it('should iterate through each file, and probe its data', async () => {
  const testFiles = ['/var/file.eng.srt', '/var/file.eng.cc.srt']
  const testStreams = stub<FfprobeData[]>([
    {
      streams: [
        {
          codec_type: 'subtitle',
        },
      ],
    },
    {
      streams: [
        {
          codec_type: 'subtitle',
        },
      ],
    },
  ])

  resolveGlobMock.mockResolvedValue(testFiles)
  probeDataFromContainerMock.mockResolvedValueOnce(testStreams[0])
  probeDataFromContainerMock.mockResolvedValueOnce(testStreams[1])

  const streams = await getExternalSubtitlesForMedia('/var/file.mkv')

  expect(streams).toEqual<SubtitleStream[]>([
    {
      streamContainerPath: testFiles[0],
      stream: testStreams[0].streams[0],
    },
    {
      streamContainerPath: testFiles[1],
      stream: testStreams[1].streams[0],
    },
  ])
})

it('should skip non-subtitle streams', async () => {
  const testFile = '/var/file.eng.srt'
  const testStream = stub<FfprobeData>({
    streams: [
      {
        codec_type: 'attachment',
      },
    ],
  })

  resolveGlobMock.mockResolvedValue([testFile])
  probeDataFromContainerMock.mockResolvedValue(testStream)

  const streams = await getExternalSubtitlesForMedia('/var/file.mkv')

  expect(streams).toEqual<SubtitleStream[]>([])
})
