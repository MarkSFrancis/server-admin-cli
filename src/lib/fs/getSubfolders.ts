import { readdir, stat } from 'fs/promises'
import { join } from 'path'

/**
 * Gets the immediate child folders of the selected path
 */
export const getSubfolders = async (path: string) => {
  const children = await readdir(path)
  const childFolders: string[] = []

  for (const child of children) {
    const childPath = join(path, child)
    const stats = await stat(childPath)

    if (stats.isDirectory()) {
      childFolders.push(childPath)
    }
  }

  return childFolders
}
