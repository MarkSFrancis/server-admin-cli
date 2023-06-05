import { convertPathToGlob } from '@/lib/fs/glob/convertPathToGlob'
import { SUBTITLE_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { basename, extname } from 'path'

export const getExternalMovieSubtitlesGlobs = (path: string): string[] => {
  path = path.replaceAll('\\', '/') // windows support

  const pathExt = extname(path)
  const filename = basename(path, pathExt)
  const parentDir = path.substring(
    0,
    path.length - (filename.length + pathExt.length + '/'.length)
  )

  return [childFolderContainingSubtitlesGlob(parentDir)]
}

const subtitleFileGlob = `*+(${SUBTITLE_FILE_EXTENSIONS.join('|')})`

const childFolderContainingSubtitlesGlob = (parentDir: string) =>
  `${convertPathToGlob(parentDir)}/**/${subtitleFileGlob}`
