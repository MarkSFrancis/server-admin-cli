import klaw, { Item } from 'klaw'
import { extname } from 'path'

/**
 * Gets all files in a directory recursively, filtered by file extensions
 */
export const getAllFilesOfTypeInDir = async (
  dir: string,
  extensions: string[]
) => {
  const allFiles = await getAllFilesInDir(dir)

  const videoFiles = allFiles.filter((f) => {
    const ext = extname(f.path)

    if (extensions.includes(ext.toLowerCase())) {
      return true
    } else {
      return false
    }
  })

  return videoFiles
}

/**
 * Recursively gets all files from within a directory
 */
export const getAllFilesInDir = async (dir: string) => {
  return await new Promise<Item[]>((resolve, reject) => {
    const allFiles: Item[] = []

    klaw(dir)
      .on('data', (file) => allFiles.push(file))
      .on('end', () => resolve(allFiles))
      .on('error', (err) => reject(err))
  })
}
