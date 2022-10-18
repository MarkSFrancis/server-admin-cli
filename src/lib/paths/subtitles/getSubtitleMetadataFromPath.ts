import { getLanguageFromCode } from '@/lib/language/getLanguageFromCode'
import { SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream'
import { basename, extname } from 'path'
import { externalSubtitlesMetaFlags } from './externalSubtitlesMetaFlags'

export const getSubtitleMetadataFromPath = (path: string): SubtitleMetadata => {
  const filenameWithExt = basename(path)
  const extension = extname(filenameWithExt)
  let filenameWithoutSuffixes = filenameWithExt
    .substring(0, filenameWithExt.length - extension.length)
    .toLowerCase()

  let isClosedCaptions = false
  let isSubtitlesForDeafAndHardOfHearing = false
  let isForced = false
  let language: string | undefined
  let isFilenameSuffixesParsed = false

  do {
    const currentSuffix = extname(filenameWithoutSuffixes).toLowerCase()

    switch (currentSuffix) {
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
          const possibleLanguage = getLanguageFromCode(
            currentSuffix.substring(1)
          )

          if (possibleLanguage) {
            language = currentSuffix.substring(1)
            break
          }
        }

        isFilenameSuffixesParsed = true
        break
    }

    filenameWithoutSuffixes = filenameWithoutSuffixes.substring(
      0,
      filenameWithoutSuffixes.length - currentSuffix.length
    )
  } while (!isFilenameSuffixesParsed)

  return {
    closedCaptions: isClosedCaptions || isSubtitlesForDeafAndHardOfHearing,
    forced: isForced,
    language,
    codec: extension.length === 0 ? undefined : extension.substring(1),
  }
}
