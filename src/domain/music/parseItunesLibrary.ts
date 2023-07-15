import { readFile } from 'fs/promises'

// I am aware this code is absolute garbage, but it works on my machine so I'm happy 😝

export const parseItunesLibrary = async (xmlLibraryPath: string) => {
  if (!xmlLibraryPath.endsWith('.xml')) {
    throw new Error('Only XML library exports are supported')
  }

  const fileContents = await readFile(xmlLibraryPath, 'utf-8')
  const xmlRows = fileContents.split('\n')

  const tracksStartIdx =
    xmlRows.findIndex((r) => r.trim() === '<key>Tracks</key>') + 1
  if (xmlRows[tracksStartIdx].trim() !== '<dict>') {
    // I give up
    throw new Error('Unrecognised iTunes library XML')
  }

  const tracksEndIdx =
    xmlRows.findIndex((r) => r.trim() === '<key>Playlists</key>') - 1
  if (xmlRows[tracksEndIdx + 2].trim() !== '<array>') {
    // I give up
    throw new Error('Unrecognised iTunes library XML')
  }

  let curIdx = tracksStartIdx + 1
  const library: ItunesLibrary = {
    tracks: [],
  }
  while (curIdx !== tracksEndIdx) {
    const { track, endIndex } = readTrack(xmlRows, curIdx)
    library.tracks.push(track)
    curIdx = endIndex + 1
  }

  return library
}

const readTrack = (xmlRows: string[], startIndex: number) => {
  if (xmlRows[startIndex].match(/<key>\d+<\/key>/) === null) {
    throw new Error(`Invalid track start point (row ID ${startIndex}`)
  } else if (xmlRows[startIndex + 1].trim() !== '<dict>') {
    throw new Error(`Invalid track start point (row ID ${startIndex})`)
  }

  let rowIdx = startIndex + 2
  const rawTrackData: Record<string, string | number | boolean> = {}
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let rowContent = xmlRows[rowIdx].trim()

    if (rowContent === '</dict>') {
      break
    }

    const key = (
      rowContent.match(/<key>(.*)<\/key>/) as [string, keyof RawItunesTrackData]
    )[1]
    const valueType = getTrackKeyType(key)

    let value: string
    if (valueType === 'boolean') {
      value = rowContent.match(/<true\/>/) ? 'true' : 'false'
    } else {
      while (rowContent.match(new RegExp(`</${valueType}>`)) === null) {
        rowIdx++
        rowContent += xmlRows[rowIdx].trim()
      }

      value = (
        rowContent.match(new RegExp(`<${valueType}>(.*)</${valueType}>`)) as [
          string,
          string,
        ]
      )[1]
    }

    rawTrackData[key] =
      valueType === 'integer'
        ? parseInt(value)
        : valueType === 'boolean'
        ? Boolean(value)
        : value.replaceAll('&#38;', '&')
    rowIdx++
  }

  const trackData = rawTrackData as unknown as RawItunesTrackData

  const mapped: ItunesTrackData = {
    id: trackData['Track ID'],
    title: trackData.Name,
    artist: trackData.Artist,
    genre: trackData.Genre,
    sizeBytes: trackData.Size,
    bitRate: trackData['Bit Rate'],
    bpm: trackData.BPM,
    dateAdded: trackData['Date Added'],
    dateModified: trackData['Date Modified'],
    lengthMs: trackData['Total Time'],
    playCount: trackData['Play Count'] ?? 0,
    sampleRate: trackData['Sample Rate'],
    skipCount: trackData['Skip Count'] ?? 0,
    path: decodeURIComponent(
      trackData['Location'].replace('file://localhost/', '')
    ).replace('C:/', '/mnt/c/'),
  }

  return {
    track: mapped,
    endIndex: rowIdx,
  }
}

const getTrackKeyType = (
  key: keyof RawItunesTrackData
): 'integer' | 'string' | 'date' | 'boolean' => {
  switch (key) {
    case 'Track ID':
    case 'Size':
    case 'Total Time':
    case 'Start Time':
    case 'Disc Number':
    case 'Disc Count':
    case 'Track Number':
    case 'Track Count':
    case 'Year':
    case 'BPM':
    case 'Bit Rate':
    case 'Sample Rate':
    case 'Play Count':
    case 'Play Date':
    case 'Skip Count':
    case 'Artwork Count':
    case 'Normalization':
    case 'File Folder Count':
    case 'Library Folder Count':
      return 'integer'
    case 'Date Modified':
    case 'Date Added':
    case 'Play Date UTC':
    case 'Skip Date':
      return 'date'
    case 'Compilation':
    case 'Purchased':
      return 'boolean'
    default:
      return 'string'
  }
}

interface RawItunesTrackData {
  'Track ID': number
  Name: string
  Artist: string
  'Album Artist': string
  Composer: string
  Genre: string
  Kind: string
  Size: number
  'Total Time': number
  'Start Time': number
  'Disc Number': number
  'Disc Count': number
  'Track Number': number
  'Track Count': number
  Year: number
  BPM: number
  'Date Modified': string
  'Date Added': string
  'Bit Rate': number
  Comments: string
  'Sample Rate': number
  'Play Count': number
  'Play Date': number
  'Play Date UTC': string
  'Skip Count': number
  'Skip Date': string
  Compilation: boolean
  Normalization: number
  'Artwork Count': number
  'Sort Album': string
  'Sort Artist': string
  'Persistent ID': string
  'Track Type': string
  Purchased: boolean
  Location: string
  'File Folder Count': number
  'Library Folder Count': number
}

export interface ItunesTrackData {
  id: number
  title: string
  artist: string
  genre: string
  sizeBytes: number
  lengthMs: number
  bpm: number
  dateAdded: string
  dateModified: string
  bitRate: number
  sampleRate: number
  playCount: number
  skipCount: number
  path: string
}

interface ItunesLibrary {
  tracks: ItunesTrackData[]
}
