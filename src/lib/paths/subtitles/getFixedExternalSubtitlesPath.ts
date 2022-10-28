import { findLanguageByCode } from '../../language/findLanguageByCode'
import { SubtitleMetadata } from '../../media-container/subtitles/getSubtitleMetadataFromStream'
import { externalSubtitlesMetaFlags } from './externalSubtitlesMetaFlags'
import { extname } from 'path'

export const getFixedExternalSubtitlesPath = (
  pairedMediaPath: string,
  subsMeta: SubtitleMetadata,
  copyNumber = 1
) => {
  if (!subsMeta.codec) {
    throw new Error(
      'Cannot set an external path for subtitles without a known codec'
    )
  }

  const mediaExt = extname(pairedMediaPath)
  let mediaPathWithoutExt = pairedMediaPath.substring(
    0,
    pairedMediaPath.length - mediaExt.length
  )

  if (copyNumber !== 1) {
    mediaPathWithoutExt += ` (${copyNumber})`
  }

  let flags = ''

  if (subsMeta.language) {
    const language = findLanguageByCode(subsMeta.language)
    const languageCode = language?.iso6392B ?? language?.iso6391

    if (languageCode) {
      flags += `.${languageCode}`
    }
  }
  if (subsMeta.isForced) {
    flags += `.${externalSubtitlesMetaFlags.forced}`
  }
  if (subsMeta.isClosedCaptions) {
    flags += `.${externalSubtitlesMetaFlags.closedCaptions}`
  }

  return `${mediaPathWithoutExt}${flags}.${subsMeta.codec}`
}
