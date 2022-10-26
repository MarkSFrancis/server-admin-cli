import { moveFile } from '@/lib/fs/moveFile'
import { getSubtitleMetadataFromPath } from '@/lib/paths/subtitles/getSubtitleMetadataFromPath'
import { askForMissingSubtitlesMeta } from './askForMissingSubtitlesMeta'
import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getFixedExternalSubtitlesPath } from '@/lib/paths/subtitles/getFixedExternalSubtitlesPath'
import { guessSubtitleMetaFromSiblings } from './guessSubtitleMetaFromSiblings'
import { stat } from 'fs/promises'

export const fixExternalSubtitlesFilename = async (
  originalMediaPath: string,
  newMediaPath: string
) => {
  const externalSubtitlesPaths = await getExternalSubtitlesForMedia(
    originalMediaPath
  )

  const fileStats = await Promise.all(
    externalSubtitlesPaths.map(async (s) => ({ stats: await stat(s), path: s }))
  )

  let idx = 1
  for (const filePath of externalSubtitlesPaths) {
    console.log(
      `Organising subtitle ${idx} of ${externalSubtitlesPaths.length}`
    )
    console.log(filePath)

    let subtitleMeta = getSubtitleMetadataFromPath(filePath)

    subtitleMeta = await guessSubtitleMetaFromSiblings(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fileStats.find((f) => f.path === filePath)!.stats,
      subtitleMeta,
      fileStats.filter((f) => f.path !== filePath).map((f) => f.stats)
    )

    subtitleMeta = await askForMissingSubtitlesMeta(subtitleMeta)

    const fixedPath = getFixedExternalSubtitlesPath(newMediaPath, subtitleMeta)

    await moveFile(filePath, fixedPath, { overwrite: false })
    idx++
  }
}
