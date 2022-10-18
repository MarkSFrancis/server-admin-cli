import { consolePrompt } from '../../console/askUserForInput'
import { getTvSeasonNumber } from './getTvSeasonNumber'

jest.mock('../../console/askUserForInput')

const askUserForInputMock = jest.mocked(consolePrompt)

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
