import { Item } from 'klaw'
import { extname } from 'path'

/**
 * Creates a predicate for filtering by file extension
 * @example
 * ```
 * const videoFiles = allFiles.filter(filterByExtension(VIDEO_FILE_EXTENSIONS))
 * ```
 */
export const filterByExtension = (extensions: string[]) => {
  const lowerExts = extensions.map((e) => e.toLowerCase())

  const predicate = (file: Item) => {
    const ext = extname(file.path)

    if (lowerExts.includes(ext.toLowerCase())) {
      return true
    } else {
      return false
    }
  }

  return predicate
}
