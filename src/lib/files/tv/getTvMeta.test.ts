import { askUserForInput } from '../../console'
import { mocked } from 'ts-jest/utils'
import { getTvEpisodeNumber, getTvSeasonNumber } from './getTvMeta'

jest.mock('../../console')

const askUserForInputMock = mocked(askUserForInput)

describe('getTvSeasonNumber', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    askUserForInputMock.mockRejectedValue(
      new Error('Mock should not have been called')
    )
  })

  it('should return 1 when the path includes "S1" in a a parent folder', async () => {
    const seasonNumber = await getTvSeasonNumber('/S1/E01.mkv')

    expect(seasonNumber).toEqual(1)
  })

  it('should return 2 when the path includes "Season 2" in a a parent folder', async () => {
    const seasonNumber = await getTvSeasonNumber('/Season 2/E01.mkv')

    expect(seasonNumber).toEqual(2)
  })

  it('should return 1 when the basename includes "S01"', async () => {
    const seasonNumber = await getTvSeasonNumber('/S01E01.mkv')

    expect(seasonNumber).toEqual(1)
  })

  it('should return 2 when the basename includes "Season 2"', async () => {
    const seasonNumber = await getTvSeasonNumber('/Season 2 E01.mkv')

    expect(seasonNumber).toEqual(2)
  })

  it('should ask for input when the path and basename include conflicting season IDs', async () => {
    askUserForInputMock.mockResolvedValue('5')
    const seasonNumber = await getTvSeasonNumber('/S01/Season 2 E01.mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(1)
    expect(seasonNumber).toEqual(5)
  })

  it('should ask for input when no season IDs are found', async () => {
    askUserForInputMock.mockResolvedValue('5')
    const seasonNumber = await getTvSeasonNumber('/E01.mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(1)
    expect(seasonNumber).toEqual(5)
  })

  it('should use season when the path and basename include matching season IDs', async () => {
    const seasonNumber = await getTvSeasonNumber('/S02/Season 2 E01.mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(0)
    expect(seasonNumber).toEqual(2)
  })
})

describe('getTvEpisodeNumber', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    askUserForInputMock.mockRejectedValue(
      new Error('Mock should not have been called')
    )
  })

  it('should return 2 when the basename includes "E02"', async () => {
    const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv')

    expect(episodeNumber).toEqual(2)
  })

  it('should ignore folders and only match on basename', async () => {
    const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv')

    expect(episodeNumber).toEqual(2)
  })

  it('should return 2 when the basename includes "Episode 2"', async () => {
    const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv')

    expect(episodeNumber).toEqual(2)
  })

  it('should ask for input when the conflicting episode IDs are found', async () => {
    askUserForInputMock.mockResolvedValue('5')
    const episodeNumber = await getTvEpisodeNumber('/E01 [E02].mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(1)
    expect(episodeNumber).toEqual(5)
  })

  it('should ask for input when no episode IDs are found', async () => {
    askUserForInputMock.mockResolvedValue('5')
    const episodeNumber = await getTvEpisodeNumber('/My Episode.mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(1)
    expect(episodeNumber).toEqual(5)
  })

  it('should use episode when matching episode IDs are found', async () => {
    const episodeNumber = await getTvEpisodeNumber('/E02 (Episode 2).mkv')

    expect(askUserForInputMock).toHaveBeenCalledTimes(0)
    expect(episodeNumber).toEqual(2)
  })
})
