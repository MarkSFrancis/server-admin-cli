import { moveFile } from '#/lib/fs/moveFile.ts';
import { getFixedTvEpisodePath } from '#/lib/paths/tv/getFixedTvEpisodePath.ts';

export const fixTvFilename = async (filePath: string) => {
  const newPath = await getFixedTvEpisodePath(filePath);

  if (newPath !== filePath) {
    await moveFile(filePath, newPath, { overwrite: false });
  }

  return newPath;
};
