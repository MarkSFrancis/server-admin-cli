import { mkdir, rename } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'
import { pathExists } from './pathExists'

/**
 * Moves a file to a new path, creating any necessary folders
 * @param oldPath
 * @param newPath
 * @returns
 */
export const moveFile = async (
  oldPath: string,
  newPath: string,
  options: { overwrite: boolean; renameOnDuplicate?: boolean }
) => {
  if (oldPath === newPath) return

  if (!options.overwrite) {
    if (await pathExists(newPath)) {
      if (options.renameOnDuplicate) {
        let conflictId = 1
        do {
          conflictId++
          newPath = fixPathConflict(newPath, conflictId)
        } while (await pathExists(newPath))
      } else {
        throw new Error(
          `Path ${newPath} already exists and cannot be overwritten`
        )
      }
    }
  }

  await mkdir(dirname(newPath), { recursive: true })

  await rename(oldPath, newPath)

  return newPath
}

const fixPathConflict = (path: string, conflictId: number) => {
  const ext = extname(path)
  const fileName = basename(path, extname(path))

  const fixedFilename = `${fileName} (${conflictId})${ext}`

  return join(dirname(path), fixedFilename)
}
