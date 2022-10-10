import { mkdir, rename } from 'fs/promises'
import { dirname } from 'path'
import { pathExists } from './fileExists'

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
  await mkdir(dirname(newPath), { recursive: true })

  if (!options.overwrite) {
    if (await pathExists(newPath)) {
      throw new Error('Path already exists and cannot be overwritten')
    }
  }

  await rename(oldPath, newPath)

  return newPath
}
