import { getAudioStreamsFromContainer } from '@/lib/media-container/audio/getAudioStreamsFromContainer'
import { getStreamLanguage } from '@/lib/media-container/getStreamLanguage'

export const getAudioLanguages = async (path: string) => {
  const streams = await getAudioStreamsFromContainer(path)

  const languages = streams.map((s) => getStreamLanguage(s.stream))

  return languages
}
