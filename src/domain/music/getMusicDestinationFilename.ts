import path, { join, normalize } from 'path'
import { BasicMusicMeta } from './getMusicMeta'

/**
 * Gets where a music file should be stored in the music library according to organisation rules
 * @param baseDirectory The folder to store the music in
 * @param meta The meta for the music file to determine the destination filename
 * @param ext The extension of the file
 */
export const getMusicDestinationFilename = (
  baseDirectory: string,
  meta: BasicMusicMeta,
  ext: string
) => {
  const albumArtist = meta.album_artist ?? meta.artist ?? 'Various Artists'
  const album = meta.album ?? 'Unknown Album'
  const trackName = meta.track ? `${meta.track} - ${meta.title}` : meta.title

  const destination = join(
    baseDirectory,
    albumArtist,
    album,
    `${trackName}${ext}`
  )

  return destination
}
