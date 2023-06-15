import { getExternalSubtitlesForTv } from '@/domain/subtitles/getExternalSubtitlesForTv'
import { getStreamLanguage } from '@/lib/media-container/getStreamLanguage'
import { getSubtitleStreamsFromContainer } from '@/lib/media-container/subtitles/getSubtitleStreamsFromContainer'
import { getSubtitleMetadataFromPath } from '@/lib/paths/subtitles/getSubtitleMetadataFromPath'

export const getSubtitleLanguages = async (path: string) => {
  const streams = await getSubtitleStreamsFromContainer(path)

  const internal = streams.map((s) => getStreamLanguage(s.stream))

  const externalSubtitles = await getExternalSubtitlesForTv(path)

  const external = externalSubtitles
    .map((subPath) => getSubtitleMetadataFromPath(subPath))
    .map((s) => s.language)
    .filter((s): s is string => !!s)

  return {
    internal,
    external,
  }
}
