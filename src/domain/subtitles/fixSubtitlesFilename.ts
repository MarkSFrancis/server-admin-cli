import { moveFile } from '@/lib/fs/moveFile'
import { getSubtitleMetadataFromPath } from '@/lib/paths/subtitles/getSubtitleMetadataFromPath'
import { askForMissingSubtitlesMeta } from './askForMissingSubtitlesMeta'
import { getExternalSubtitlesForMedia } from './getExternalSubtitlesForMedia'
import { getFixedExternalSubtitlesPath } from '@/lib/paths/subtitles/getFixedExternalSubtitlesPath'
import { stat } from 'fs/promises'
import {
  type SubtitleGroupMember,
  guessSubtitleMetaFromGroupMeta,
} from '@/lib/paths/subtitles/guessSubtitleMetaFromGroupMeta'
import { pathExists } from '@/lib/fs/pathExists'
import { prompt } from 'inquirer'
import { basename } from 'path'

export const fixExternalSubtitlesFilename = async (
  originalMediaPath: string,
  newMediaPath: string
) => {
  const externalSubtitlesPaths = await getExternalSubtitlesForMedia(
    originalMediaPath
  )

  const externalSubtitles = await getBasicSubtitlesMeta(externalSubtitlesPaths)

  let idx = 1
  for (const subtitles of externalSubtitles) {
    console.info(
      `Organising subtitle ${idx} of ${externalSubtitlesPaths.length}`
    )
    console.info(subtitles.path)

    await populateMissingMeta(subtitles, externalSubtitles)

    const newSubtitlesPath = await moveSubtitles(newMediaPath, subtitles)

    console.info(`Moved to ${newSubtitlesPath}`)
    idx++
  }
}

const getBasicSubtitlesMeta = async (
  paths: string[]
): Promise<SubtitleGroupMember[]> => {
  return await Promise.all(
    paths.map(async (path) => {
      const fileStats = await stat(path)
      const meta = getSubtitleMetadataFromPath(path)

      return {
        path,
        sizeBytes: fileStats.size,
        meta,
      }
    })
  )
}

const populateMissingMeta = async (
  subtitles: SubtitleGroupMember,
  allExternalSubtitles: SubtitleGroupMember[]
) => {
  subtitles.meta = await guessSubtitleMetaFromGroupMeta(
    subtitles,
    allExternalSubtitles.filter((s) => s !== subtitles)
  )

  subtitles.meta = await askForMissingSubtitlesMeta(subtitles.meta)
}

const moveSubtitles = async (
  newMediaPath: string,
  subtitles: SubtitleGroupMember
) => {
  let fixedPath = getFixedExternalSubtitlesPath(newMediaPath, subtitles.meta)

  if (fixedPath === subtitles.path) {
    return fixedPath
  }

  if (await pathExists(fixedPath)) {
    const response = await prompt([
      {
        name: 'move',
        type: 'expand',
        message: `Conflict on ${basename(fixedPath)}`,
        choices: [
          {
            key: 'y',
            name: 'Overwrite',
            value: 'overwrite',
          },
          {
            key: 'r',
            name: 'Rename',
            value: 'rename',
          },
          {
            key: 'n',
            name: 'Skip',
            value: 'skip',
          },
        ],
      },
    ])

    switch (response.move) {
      case 'overwrite':
        await moveFile(subtitles.path, fixedPath, { overwrite: true })
        break
      case 'rename':
        {
          let copyNumber = 2
          do {
            fixedPath = getFixedExternalSubtitlesPath(
              newMediaPath,
              subtitles.meta,
              copyNumber
            )

            copyNumber++
          } while (await pathExists(fixedPath))

          await moveFile(subtitles.path, fixedPath, { overwrite: false })
        }
        break
      case 'skip':
        break
      default:
        throw new Error(`Unknown option ${response.move as string}`)
    }
  } else {
    await moveFile(subtitles.path, fixedPath, { overwrite: false })
  }

  return fixedPath
}
