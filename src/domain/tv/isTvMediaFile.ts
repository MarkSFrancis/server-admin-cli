import { VIDEO_FILE_EXTENSIONS } from '@/lib/files/exts'
import { extname } from 'path'

export const isTvMediaFile = (path: string) => {
  const ext = extname(path).toLowerCase()

  if (VIDEO_FILE_EXTENSIONS.includes(ext)) {
    return true
  }
}
