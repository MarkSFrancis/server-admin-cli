import { extname } from 'path'

/**
 * Creates a predicate for filtering by file extension
 * @example
 * ```
 * const videoFiles = allFiles.filter(filterByExtension(VIDEO_FILE_EXTENSIONS))
 * ```
 */
export const filterByExtension = (extensions: string[]) => {
  const predicate = (path: string) => pathMatchesExtension(path, extensions)

  return predicate
}

/**
 * Gets whether a path matches one or more of a range of given extensions. This is case insensitive
 */
export const pathMatchesExtension = (path: string, extensions: string[]) => {
  const ext = extname(path).toLowerCase()

  if (extensions.some((e) => e.toLowerCase() === ext)) {
    return true
  } else {
    return false
  }
}
