import { Stats } from 'fs'
import { stat, readdir } from 'fs/promises'
import { stub } from '../test-utils/stub'
import { getSubfolders } from './getSubfolders'

jest.mock('fs/promises')

const statMock = jest.mocked(stat)
const readdirMock = jest.mocked(readdir as (path: string) => Promise<string[]>)

beforeEach(() => {
  jest.resetAllMocks()
})

it('should return a list of subfolders if the path exists', async () => {
  readdirMock.mockResolvedValue(['dir-path-1', 'dir-path-2'])
  statMock.mockResolvedValue(
    stub<Stats>({
      isDirectory: () => true,
    })
  )

  const subdirs = await getSubfolders('/var/')

  expect(subdirs).toEqual(['/var/dir-path-1', '/var/dir-path-2'])
})

it('should throw an error if the path does not exist', async () => {
  readdirMock.mockRejectedValue(new Error())

  await expect(async () => await getSubfolders('/var/')).rejects.toBeInstanceOf(
    Error
  )
})

it('should exclude files from the result', async () => {
  readdirMock.mockResolvedValue(['dir-path-1', 'file-path-1', 'dir-path-2'])
  statMock.mockResolvedValueOnce(
    stub<Stats>({
      isDirectory: () => true,
    })
  )
  statMock.mockResolvedValueOnce(
    stub<Stats>({
      isDirectory: () => false,
    })
  )
  statMock.mockResolvedValueOnce(
    stub<Stats>({
      isDirectory: () => true,
    })
  )

  const subfolders = await getSubfolders('/var/')

  expect(subfolders).toEqual(['/var/dir-path-1', '/var/dir-path-2'])
})
