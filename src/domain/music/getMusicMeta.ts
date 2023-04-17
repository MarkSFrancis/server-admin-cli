import { probeDataFromContainer } from '@/lib/media-container/probeStreamsFromContainer'

export interface BasicMusicMeta {
  title?: string
  artist?: string
  album_artist?: string
  album?: string
  track?: string
  genre?: string
}

export const getMusicMeta = async (path: string) => {
  const data = await probeDataFromContainer(path)

  return data.format.tags
}

export const getBasicMusicMeta = (
  meta: Record<string, string | number> | undefined
): BasicMusicMeta | undefined => {
  if (!meta) return

  const { title, artist, album_artist, album, track, genre } = meta as Record<
    string,
    string
  >

  return {
    title,
    artist,
    album_artist,
    album,
    track,
    genre,
  }
}
