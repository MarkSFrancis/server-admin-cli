import { basename, dirname, extname, join } from 'path';
import { getTvEpisodeNumber } from './getTvEpisodeNumber';
import { getTvSeasonNumber } from './getTvSeasonNumber';

export const getFixedTvEpisodePath = async (path: string) => {
  const seasonNumber = await getTvSeasonNumber(path);
  const episodeNumber = await getTvEpisodeNumber(path);

  let seasonDir = '';
  let episodeFileName = '';

  const dir = dirname(path);
  const lastDirName = basename(dir);

  const ext = extname(path);

  const formatEpisodeNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  if (seasonNumber === 0) {
    seasonDir += 'Specials';
  } else {
    seasonDir += `Season ${seasonNumber}`;
  }

  if (lastDirName === seasonDir) {
    seasonDir = '';
  }

  if (seasonNumber === 0) {
    episodeFileName += 'S00';
  }

  episodeFileName += `E${formatEpisodeNumber(episodeNumber)}`;

  return join(dir, seasonDir, `${episodeFileName}${ext}`);
};
