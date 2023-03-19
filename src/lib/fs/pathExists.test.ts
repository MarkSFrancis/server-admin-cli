import { type Stats } from 'fs'
import { stat } from 'fs/promises'
import { stub } from '../test-utils/stub'
import { pathExists } from './pathExists'

jest.mock('fs/promises')

const statMock = jest.mocked(stat)

beforeEach(() => {
  jest.resetAllMocks()
})

it('should return `Stats` if the path exists', async () => {
  statMock.mockResolvedValue(stub<Stats>({}))

  const exists = await pathExists('/var/file.txt')

  expect(exists).toEqual({})
})

it('should return `false` if the path does not exist', async () => {
  statMock.mockRejectedValue(new Error())

  const exists = await pathExists('/var/file.txt')

  expect(exists).toEqual(false)
})

it('should return `false` if the path is invalid', async () => {
  statMock.mockRejectedValue(new Error())

  const exists = await pathExists('this?is?an?invalid?path')

  expect(exists).toEqual(false)
})
