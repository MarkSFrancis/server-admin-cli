import { getLanguageFromCode } from '@/lib/language/getLanguageFromCode'
import { SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream'
import { externalSubtitlesMetaFlags } from '@/lib/paths/subtitles/externalSubtitlesMetaFlags'
import { basename, extname } from 'path'

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
  const mediaFilename = basename(pairedMediaPath, mediaExt)

  let flags = ''

  if (subsMeta.language) {
    const language = getLanguageFromCode(subsMeta.language)
    const languageCode = language?.iso6392B ?? language?.iso6391

    if (languageCode) {
      flags += `.${languageCode}`
    }
  }
  if (subsMeta.forced) {
    flags += externalSubtitlesMetaFlags.forced
  }
  if (subsMeta.closedCaptions) {
    flags += externalSubtitlesMetaFlags.closedCaptions
  }

  return `${mediaPathWithoutExt}${mediaFilename}${flags}${subsMeta.codec}`
}
