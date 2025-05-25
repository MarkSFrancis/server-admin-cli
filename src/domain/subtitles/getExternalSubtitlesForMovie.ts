import { readFromGlob } from '@/lib/fs/glob/resolveGlob';
import { getExternalMovieSubtitlesGlobs } from '@/lib/paths/subtitles/getExternalMovieSubtitlesGlobs';

export const getExternalSubtitlesForMovie = async (
  path: string
): Promise<string[]> => {
  const globs = getExternalMovieSubtitlesGlobs(path);

  const externalSubtitlesPaths = await Promise.all(
    globs.map(async (g) => await readFromGlob(g))
  ).then((r) => r.reduce((cur, next) => [...cur, ...next]));

  return externalSubtitlesPaths;
};
