import { SubtitleMetadata } from '../../media-container/subtitles/getSubtitleMetadataFromStream'

export interface SubtitleGroupMember {
  path: string
  sizeBytes: number
  meta: SubtitleMetadata
}

export const guessSubtitleMetaFromGroupMeta = async (
  subtitles: SubtitleGroupMember,
  otherSubtitlesInGroup: SubtitleGroupMember[]
): Promise<SubtitleMetadata> => {
  if (otherSubtitlesInGroup.length === 0) {
    // Default to basic subtitles if no meta is available, and there are no other subtitles
    return {
      ...subtitles.meta,
      isForced: subtitles.meta.isForced ?? false,
      isClosedCaptions: subtitles.meta.isClosedCaptions ?? false,
    }
  }

  if (isProbablyForced(subtitles)) {
    return {
      ...subtitles.meta,
      isClosedCaptions: false,
      isForced: true,
    }
  }

  if (isProbablyClosedCaptions(subtitles, otherSubtitlesInGroup)) {
    return {
      ...subtitles.meta,
      isForced: false,
      isClosedCaptions: true,
    }
  }

  return {
    ...subtitles.meta,
    isForced: subtitles.meta.isForced ?? false,
    isClosedCaptions: subtitles.meta.isClosedCaptions ?? false,
  }
}

const isProbablyForced = (subtitles: SubtitleGroupMember) => {
  return isVerySmallSubtitleFile(subtitles.sizeBytes)
}

const isProbablyClosedCaptions = (
  subtitles: SubtitleGroupMember,
  otherSubtitles: SubtitleGroupMember[]
) => {
  const othersWithSameLanguage = otherSubtitles.filter(
    (s) => s.meta.language === subtitles.meta.language
  )

  return isSlightlyLargerSubtitleFile(
    subtitles.sizeBytes,
    othersWithSameLanguage.map((s) => s.sizeBytes)
  )
}

const TEN_KILOBYTES = 10000
const TWENTY_KILOBYTES = TEN_KILOBYTES * 2

const isVerySmallSubtitleFile = (fileSize: number) => {
  if (fileSize > TEN_KILOBYTES) {
    return false
  }

  return true
}

const isSlightlyLargerSubtitleFile = (
  fileSize: number,
  otherFileSizes: number[]
) => {
  const largestOtherFile = Math.max(...otherFileSizes)

  const sizeDiff = fileSize - largestOtherFile

  if (sizeDiff < 0) {
    // Not the largest file
    return false
  }

  if (sizeDiff > TWENTY_KILOBYTES) {
    return false
  }

  return true
}
