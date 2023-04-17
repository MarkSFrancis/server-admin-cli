import { promptForInput } from '../../console/promptForInput'
import { getTvEpisodeNumber } from './getTvEpisodeNumber'

jest.mock('../../console/promptForInput')

const promptForInputMock = jest.mocked(promptForInput)

beforeEach(() => {
  jest.resetAllMocks()

  promptForInputMock.mockRejectedValue(
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
  promptForInputMock.mockResolvedValue('5')
  const episodeNumber = await getTvEpisodeNumber('/E01 (E02).mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(1)
  expect(episodeNumber).toEqual(5)
})

it('should ask for input when no episode IDs are found', async () => {
  promptForInputMock.mockResolvedValue('5')
  const episodeNumber = await getTvEpisodeNumber('/My Episode.mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(1)
  expect(episodeNumber).toEqual(5)
})

it('should use episode when matching episode IDs are found', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E02 (Episode 2).mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(0)
  expect(episodeNumber).toEqual(2)
})

it('should ignore irrelevant [E123] monikers', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E02 [E123].mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(0)
  expect(episodeNumber).toEqual(2)
})

it('should detect number-only episode IDs', async () => {
  const episodeNumber = await getTvEpisodeNumber('Item - 03 - 1080p.mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(0)
  expect(episodeNumber).toEqual(3)
})

it('should detect episode IDs right next to season IDs', async () => {
  const episodeNumber = await getTvEpisodeNumber('S01E03.mkv')

  expect(promptForInputMock).toHaveBeenCalledTimes(0)
  expect(episodeNumber).toEqual(3)
})
