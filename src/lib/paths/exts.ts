export const VIDEO_FILE_EXTENSIONS = ['.mkv', '.mp4', '.avi', '.m4v']
export const SUBTITLE_FILE_EXTENSIONS = [
  '.ass',
  '.idx',
  '.sub',
  '.srt',
  '.ssa',
  '.smi',
  '.vtt',
]
export const MUSIC_FILE_EXTENSIONS = [
  '.m4a',
  '.mp3',
  '.opus',
  '.ogg',
  '.flac',
  '.wav',
  '.alac',
]

export const extensionsToGlobPattern = (exts: string[]) => {
  return `+(${exts.join('|')})`
}
