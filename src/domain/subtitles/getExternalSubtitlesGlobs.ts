import { SUBTITLE_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { basename, extname } from 'path'

export const getExternalSubtitlesGlobs = (path: string): string[] => {
  path = path.replaceAll('\\', '/') // windows support

  const pathExt = extname(path)
  const filename = basename(path, pathExt)
  const parentDir = path.substring(
    0,
    path.length - (filename.length + pathExt.length + '/'.length)
  )

  const fileGlobs = [
    childFolderContainingFilenameGlob(parentDir, filename),
    childFolderWithFileContainingFilenameGlob(parentDir, filename),
  ]

  return fileGlobs
}

const subtitleFileGlob = `*+(${SUBTITLE_FILE_EXTENSIONS.join('|')})`

const childFolderContainingFilenameGlob = (
  parentDir: string,
  filename: string
) => `${parentDir}/**/${filename}/**/${subtitleFileGlob}`

const childFolderWithFileContainingFilenameGlob = (
  parentDir: string,
  filename: string
) => `${parentDir}/**/${filename}${subtitleFileGlob}`
