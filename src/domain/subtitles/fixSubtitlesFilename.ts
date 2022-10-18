import { moveFile } from '@/lib/fs/moveFile'
import { getSubtitleMetadataFromPath } from '@/lib/paths/subtitles/getSubtitleMetadataFromPath'
import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getFixedExternalSubtitlesPath } from './getFixedExternalSubtitlesPath'

export const fixExternalSubtitlesFilename = async (
  originalMediaPath: string,
  newMediaPath: string
) => {
  const externalSubtitlesPaths = await getExternalSubtitlesForMedia(
    originalMediaPath
  )

  for (const filePath of externalSubtitlesPaths) {
    const subtitleMeta = getSubtitleMetadataFromPath(filePath)

    // TODO - if no language is found, ask the user
    // TODO - if no cc / sdh / forced is found, ask the user

    const fixedPath = getFixedExternalSubtitlesPath(newMediaPath, subtitleMeta)

    await moveFile(filePath, fixedPath, { overwrite: false })
  }
}
