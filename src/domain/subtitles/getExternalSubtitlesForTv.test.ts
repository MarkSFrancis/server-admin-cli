import { resolveGlob } from '@/lib/fs/glob/resolveGlob'
import { getExternalTvSubtitlesGlobs } from '@/lib/paths/subtitles/getExternalTvSubtitlesGlobs'
import { getExternalSubtitlesForTv } from './getExternalSubtitlesForTv'

jest.mock('@/lib/paths/subtitles/getExternalTvSubtitlesGlobs')
jest.mock('@/lib/fs/glob/resolveGlob')

const getExternalTvSubtitlesGlobsMock = jest.mocked(getExternalTvSubtitlesGlobs)
const resolveGlobMock = jest.mocked(resolveGlob)

beforeEach(() => {
  jest.resetAllMocks()

  getExternalTvSubtitlesGlobsMock.mockReturnValue(['test-glob'])
  resolveGlobMock.mockResolvedValue([])
})

it('should get and execute glob', async () => {
  getExternalTvSubtitlesGlobsMock.mockReturnValue(['file-glob'])

  await getExternalSubtitlesForTv('/var/file.mkv')

  expect(getExternalTvSubtitlesGlobsMock).toHaveBeenCalledWith('/var/file.mkv')
  expect(resolveGlobMock).toHaveBeenCalledWith('file-glob')
})

it('should get and execute each glob', async () => {
  getExternalTvSubtitlesGlobsMock.mockReturnValue(['file-glob', 'file-glob-2'])

  await getExternalSubtitlesForTv('/var/file.mkv')

  expect(getExternalTvSubtitlesGlobsMock).toHaveBeenCalledWith('/var/file.mkv')
  expect(resolveGlobMock).toHaveBeenCalledWith('file-glob')
  expect(resolveGlobMock).toHaveBeenCalledWith('file-glob-2')
})

it('should return all found paths', async () => {
  getExternalTvSubtitlesGlobsMock.mockReturnValue([
    'file-glob-1',
    'file-glob-2',
  ])
  resolveGlobMock.mockImplementation(async (glob) => {
    if (glob === 'file-glob-1') {
      return ['file-1', 'file-2']
    } else if (glob === 'file-glob-2') {
      return ['file-3', 'file-4', 'file-5']
    } else {
      throw new Error('Called with non-test glob')
    }
  })

  const results = await getExternalSubtitlesForTv('/var/file.mvk')

  expect(results).toContain('file-1')
  expect(results).toContain('file-2')
  expect(results).toContain('file-3')
  expect(results).toContain('file-4')
  expect(results).toContain('file-5')
})
