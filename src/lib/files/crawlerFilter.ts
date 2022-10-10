import { extname } from 'path'
import { getAllFilesInDir } from './crawler'

/**
 * Gets all files in a directory recursively, filtered by file extensions
 */
export const getAllFilesOfTypeInDir = async (
  dir: string,
  extensions: string[]
) => {
  const allFiles = await getAllFilesInDir(dir)
  const lowerExts = extensions.map((e) => e.toLowerCase())

  const videoFiles = allFiles.filter((f) => {
    const ext = extname(f.path)

    if (lowerExts.includes(ext.toLowerCase())) {
      return true
    } else {
      return false
    }
  })

  return videoFiles
}
