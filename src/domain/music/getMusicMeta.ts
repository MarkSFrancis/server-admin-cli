import { probeDataFromContainer } from '@/lib/media-container/probeStreamsFromContainer';

export interface BasicMusicMeta {
  title?: string;
  artist?: string;
  album_artist?: string;
  album?: string;
  track?: string;
  genre?: string;
}

export const getMusicMeta = async (path: string) => {
  const data = await probeDataFromContainer(path);

  let tags = data.format.tags;

  if (!tags) {
    // Fallback to stream tags (for ogg containers)
    tags = data.streams[0].tags as Record<string, string> | undefined;
  }

  return tags;
};

export const getBasicMusicMeta = (
  meta: Record<string, string | number>
): BasicMusicMeta => {
  const {
    title,
    TITLE,
    artist,
    ARTIST,
    album_artist,
    ALBUM_ARTIST,
    album,
    ALBUM,
    track,
    TRACK,
    genre,
    GENRE,
  } = meta as Record<string, string | undefined>;

  const trackId = getTrackId(track ?? TRACK);

  return {
    title: title ?? TITLE,
    artist: artist ?? ARTIST,
    album_artist: album_artist ?? ALBUM_ARTIST,
    album: album ?? ALBUM,
    track: trackId,
    genre: genre ?? GENRE,
  };
};

const getTrackId = (track: string | undefined) => {
  const trackId = track?.split(/\/|;/)[0];

  return trackId;
};
