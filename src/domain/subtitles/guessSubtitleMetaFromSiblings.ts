import { SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream'
import { Stats } from 'fs'

export const guessSubtitleMetaFromSiblings = async (
  fileStats: Stats,
  subtitleMeta: SubtitleMetadata,
  externalSubtitlesStats: Stats[]
): Promise<SubtitleMetadata> => {
  externalSubtitlesStats = externalSubtitlesStats.filter((p) => p !== fileStats)

  if (externalSubtitlesStats.length === 0) {
    // Default to basic subtitles if no meta is available, and there are no other subtitles
    return {
      ...subtitleMeta,
      isForced: subtitleMeta.isForced ?? false,
      isClosedCaptions: subtitleMeta.isClosedCaptions ?? false,
    }
  }

  if (isVerySmallSubtitleFile(fileStats.size)) {
    return {
      ...subtitleMeta,
      isClosedCaptions: false,
      isForced: true,
    }
  }

  if (
    isSlightlyLargerSubtitleFile(
      fileStats.size,
      externalSubtitlesStats.map((s) => s.size)
    )
  ) {
    return {
      ...subtitleMeta,
      isForced: false,
      isClosedCaptions: true,
    }
  }

  return {
    ...subtitleMeta,
    isForced: false,
    isClosedCaptions: false,
  }
}

const TEN_KILOBYTES = 10000

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

  if (sizeDiff > TEN_KILOBYTES) {
    return false
  }

  return true
}
