import { findLanguageByCode } from '../../language/findLanguageByCode'
import { SubtitleMetadata } from '../../media-container/subtitles/getSubtitleMetadataFromStream'
import { externalSubtitlesMetaFlags } from './externalSubtitlesMetaFlags'
import { extname } from 'path'

export const getFixedExternalSubtitlesPath = (
  pairedMediaPath: string,
  subsMeta: SubtitleMetadata
) => {
  if (!subsMeta.codec) {
    throw new Error(
      'Cannot set an external path for subtitles without a known codec'
    )
  }

  const mediaExt = extname(pairedMediaPath)
  const mediaPathWithoutExt = pairedMediaPath.substring(
    0,
    pairedMediaPath.length - mediaExt.length
  )

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
