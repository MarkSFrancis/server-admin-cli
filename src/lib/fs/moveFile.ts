import { mkdir, rename } from 'fs/promises'
import { dirname } from 'path'
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
  options: { overwrite: boolean }
) => {
  if (oldPath === newPath) return

  if (!options.overwrite) {
    if (await pathExists(newPath)) {
      throw new Error('Path already exists and cannot be overwritten')
    }
  }

  await mkdir(dirname(newPath), { recursive: true })

  await rename(oldPath, newPath)

  return newPath
}
