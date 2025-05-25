import { readFromGlob } from '@/lib/fs/glob/resolveGlob';
import { getExternalTvSubtitlesGlobs } from '@/lib/paths/subtitles/getExternalTvSubtitlesGlobs';

export const getExternalSubtitlesForTv = async (
  path: string
): Promise<string[]> => {
  const globs = getExternalTvSubtitlesGlobs(path);

  const externalSubtitlesPaths = await Promise.all(
    globs.map(async (g) => await readFromGlob(g))
  ).then((r) => r.reduce((cur, next) => [...cur, ...next]));

  return externalSubtitlesPaths;
};
