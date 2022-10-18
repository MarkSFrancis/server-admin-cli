import { Stats } from 'fs'
import { mkdir, rename } from 'fs/promises'
import { stub } from '../test-utils/stub'
import { pathExists } from './pathExists'
import { moveFile } from './moveFile'

jest.mock('fs/promises')
jest.mock('./pathExists')

const mkdirMock = jest.mocked(mkdir)
const renameMock = jest.mocked(rename)
const pathExistsMock = jest.mocked(pathExists)

beforeEach(() => {
  jest.resetAllMocks()

  pathExistsMock.mockResolvedValue(false)
})

it('should throw if `override` is `false` and the file already exists', async () => {
  pathExistsMock.mockResolvedValue(stub<Stats>({}))

  await expect(
    async () =>
      await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
        overwrite: false,
      })
  ).rejects.toThrowError()

  expect(pathExists).toHaveBeenCalledWith('/var/dest/file1.txt')
  expect(renameMock).not.toHaveBeenCalled()
})

it('should create the destination folder', async () => {
  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: false,
  })

  expect(mkdirMock).toHaveBeenCalledWith<Parameters<typeof mkdir>>(
    '/var/dest',
    { recursive: true }
  )
})

it('should override if `override` is `true` and the file already exists', async () => {
  pathExistsMock.mockResolvedValue(stub<Stats>({}))

  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: true,
  })

  expect(mkdirMock).toHaveBeenCalledWith<Parameters<typeof mkdir>>(
    '/var/dest',
    { recursive: true }
  )
  expect(renameMock).toHaveBeenCalledWith(
    '/var/source/file1.txt',
    '/var/dest/file1.txt'
  )
})

it('should move the file to the new path if `override` is `false` and the file does not already exist', async () => {
  pathExistsMock.mockResolvedValue(false)

  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: false,
  })

  expect(mkdirMock).toHaveBeenCalledWith<Parameters<typeof mkdir>>(
    '/var/dest',
    { recursive: true }
  )
  expect(renameMock).toHaveBeenCalledWith(
    '/var/source/file1.txt',
    '/var/dest/file1.txt'
  )
})
