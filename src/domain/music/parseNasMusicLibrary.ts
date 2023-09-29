import { convertPathToGlob } from '@/lib/fs/glob/convertPathToGlob'
import { resolveGlob } from '@/lib/fs/glob/resolveGlob'
import { SpecialFolders } from '@/lib/paths/SpeciaFolders'
import {
  MUSIC_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '@/lib/paths/exts'

export interface NasMusicEntry extends Record<string, string | number> {
  path: string
}

export const getNasMusicLibraryFiles = async () => {
  const musicFolder = SpecialFolders.Music
  const musicGlob = convertPathToGlob(musicFolder) + '**/*'

  const files = await resolveGlob(
    `${musicGlob}${extensionsToGlobPattern(MUSIC_FILE_EXTENSIONS)}`,
    {
      nodir: true,
    }
  )

  return files
}
