import { findLanguageByCode } from '@/lib/language/findLanguageByCode'
import { SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream'
import { basename, extname } from 'path'
import { externalSubtitlesMetaFlags } from './externalSubtitlesMetaFlags'

export const getSubtitleMetadataFromPath = (path: string): SubtitleMetadata => {
  const filenameWithExt = basename(path)
  const extension = extname(filenameWithExt)
  let remainingFileNameToParse = filenameWithExt
    .substring(0, filenameWithExt.length - extension.length)
    .toLowerCase()

  let isClosedCaptions: boolean | undefined
  let isSubtitlesForDeafAndHardOfHearing: boolean | undefined
  let isForced: boolean | undefined
  let language: string | undefined
  let isFilenameSuffixesParsed = false

  do {
    const subtitleFileNameFlags = getNextFlag(remainingFileNameToParse)

    switch (subtitleFileNameFlags.currentFlag) {
      case externalSubtitlesMetaFlags.closedCaptions:
        isClosedCaptions = true
        break
      case externalSubtitlesMetaFlags.isSubtitlesForDeafAndHardOfHearing:
        isSubtitlesForDeafAndHardOfHearing = true
        break
      case externalSubtitlesMetaFlags.forced:
        isForced = true
        break
      default:
        if (!language) {
          const possibleLanguage = findLanguageByCode(
            subtitleFileNameFlags.currentFlag
          )

          if (possibleLanguage) {
            language = subtitleFileNameFlags.currentFlag
            break
          }
        }

        isFilenameSuffixesParsed = true
        break
    }

    remainingFileNameToParse = subtitleFileNameFlags.remainingFileName
  } while (!isFilenameSuffixesParsed)

  return {
    isClosedCaptions: isClosedCaptions ?? isSubtitlesForDeafAndHardOfHearing,
    isForced,
    language,
    codec: extension.length === 0 ? undefined : extension.substring(1),
  }
}

const getNextFlag = (
  fileName: string
): { currentFlag: string; remainingFileName: string } => {
  const nextFlagStart = Math.max(
    fileName.lastIndexOf('.'),
    fileName.lastIndexOf('_')
  )

  if (nextFlagStart === -1) {
    return {
      currentFlag: fileName.toLowerCase(),
      remainingFileName: '',
    }
  }

  return {
    currentFlag: fileName.substring(nextFlagStart + 1).toLowerCase(),
    remainingFileName: fileName.substring(0, nextFlagStart),
  }
}
