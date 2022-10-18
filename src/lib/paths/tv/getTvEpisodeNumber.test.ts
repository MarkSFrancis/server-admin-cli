import { consolePrompt } from '../../console/askUserForInput'
import { getTvEpisodeNumber } from './getTvEpisodeNumber'

jest.mock('../../console/askUserForInput')

const askUserForInputMock = jest.mocked(consolePrompt)

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
