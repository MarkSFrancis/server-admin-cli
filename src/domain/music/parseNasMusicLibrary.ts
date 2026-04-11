import { convertPathToGlob } from '#/lib/fs/glob/convertPathToGlob.ts';
import { readFilesFromGlob } from '#/lib/fs/glob/resolveGlob.ts';
import { SpecialFolders } from '#/lib/paths/SpeciaFolders.ts';
import {
  MUSIC_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '#/lib/paths/exts.ts';

export interface NasMusicEntry extends Record<string, string | number> {
  path: string;
}

export const getNasMusicLibraryFiles = async () => {
  const musicFolder = SpecialFolders.Music;
  const musicGlob = convertPathToGlob(musicFolder) + '**/*';

  const files = await readFilesFromGlob(
    `${musicGlob}${extensionsToGlobPattern(MUSIC_FILE_EXTENSIONS)}`
  );

  return files;
};
