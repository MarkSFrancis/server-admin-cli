import { getFixedTvEpisodePath } from './getFixedTvEpisodePath'
import { getTvEpisodeNumber, getTvSeasonNumber } from './getTvMeta'

jest.mock('./getTvMeta')

const getTvSeasonNumberMock = jest.mocked(getTvSeasonNumber)
const getTvEpisodeNumberMock = jest.mocked(getTvEpisodeNumber)

const defaults = {
  seasonNumber: 2,
  episodeNumber: 3,
}

describe('getFixedTvEpisodePath', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    getTvSeasonNumberMock.mockResolvedValue(defaults.seasonNumber)
    getTvEpisodeNumberMock.mockResolvedValue(defaults.episodeNumber)
  })

  it('should preserve current episode path', async () => {
    const rootPath = '/test1/test2/test3/test4'
    const fixedPath = await getFixedTvEpisodePath(`${rootPath}/File.mkv`)

    expect(fixedPath.startsWith(rootPath)).toBeTruthy()
  })

  it('should preserve file extension', async () => {
    const fixedPath = await getFixedTvEpisodePath(`/File.mp3`)

    expect(fixedPath.endsWith('.mp3')).toBeTruthy()
  })

  it('should set episode name as a padded episode number', async () => {
    getTvEpisodeNumberMock.mockResolvedValue(1)

    const fixedPath = await getFixedTvEpisodePath(`/File.mkv`)

    expect(fixedPath.endsWith('/E01.mkv')).toBeTruthy()
  })

  it("should set episode name without padding if it's 3 digits long", async () => {
    getTvEpisodeNumberMock.mockResolvedValue(200)

    const fixedPath = await getFixedTvEpisodePath(`/File.mkv`)

    expect(fixedPath.endsWith('/E200.mkv')).toBeTruthy()
  })

  it("should create season folder if one doesn't exist", async () => {
    getTvSeasonNumberMock.mockResolvedValue(2)

    const fixedPath = await getFixedTvEpisodePath(`/File.mkv`)

    expect(fixedPath.startsWith('/Season 2/')).toBeTruthy()
  })

  it('should not create season folder if one already exists', async () => {
    getTvSeasonNumberMock.mockResolvedValue(2)
    getTvEpisodeNumberMock.mockResolvedValue(1)

    const fixedPath = await getFixedTvEpisodePath(`/Season 2/File.mkv`)

    expect(fixedPath).toEqual('/Season 2/E01.mkv')
  })

  it('should use Specials if season is zero', async () => {
    getTvSeasonNumberMock.mockResolvedValue(0)

    const fixedPath = await getFixedTvEpisodePath(`/File.mkv`)

    expect(fixedPath.startsWith('/Specials/')).toBeTruthy()
  })

  it('should not create Specials folder if one already exists', async () => {
    getTvSeasonNumberMock.mockResolvedValue(0)
    getTvEpisodeNumberMock.mockResolvedValue(1)

    const fixedPath = await getFixedTvEpisodePath(`/Specials/File.mkv`)

    expect(fixedPath).toEqual('/Specials/S00E01.mkv')
  })

  it('should use S00 in filename if season is zero', async () => {
    getTvSeasonNumberMock.mockResolvedValue(0)
    getTvEpisodeNumberMock.mockResolvedValue(1)

    const fixedPath = await getFixedTvEpisodePath(`/File.mkv`)

    expect(fixedPath).toEqual('/Specials/S00E01.mkv')
  })
})
