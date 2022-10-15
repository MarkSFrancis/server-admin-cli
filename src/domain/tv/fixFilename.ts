import { moveFile } from '@/lib/paths/moveFile'
import { getFixedTvEpisodePath } from '@/lib/paths/tv/getFixedTvEpisodePath'

export const fixTvFilename = async (filePath: string) => {
  const newPath = await getFixedTvEpisodePath(filePath)

  if (newPath !== filePath) {
    await moveFile(filePath, newPath, { overwrite: false })
  }

  return newPath
}
