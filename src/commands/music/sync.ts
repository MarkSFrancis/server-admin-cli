import { Command } from 'commander'
import {
  NasMusicEntry,
  getNasMusicLibraryFiles,
} from '@/domain/music/parseNasMusicLibrary'
import { getBasicMusicMeta, getMusicMeta } from '@/domain/music/getMusicMeta'
import { parseItunesLibrary } from '@/domain/music/parseItunesLibrary'
import { readFile, writeFile } from 'fs/promises'
import { pathExists } from '@/lib/fs/pathExists'
import { basename } from 'path'

// TODO - remove user-specific paths
const filesCache = '/home/mark/nas-music-files.json'
const metaCache = '/home/mark/nas-music-meta.json'

export const musicSyncCommand = new Command('sync').action(async () => {
  console.info('Parsing library...')
  let musicMeta: NasMusicEntry[]

  if (await pathExists(metaCache)) {
    const cachedMeta = await readFile(metaCache, 'utf-8')
    musicMeta = JSON.parse(cachedMeta)
  } else {
    let files: string[]
    if (await pathExists(filesCache)) {
      const cachedFiles = await readFile(filesCache, 'utf-8')
      files = JSON.parse(cachedFiles)
    } else {
      files = await getNasMusicLibraryFiles()

      await writeFile(filesCache, JSON.stringify(files), 'utf-8')
    }

    console.info(`Detected ${files.length} files. Parsing metadata...`)

    musicMeta = []
    for (const path of files) {
      console.info(`Parsing ${basename(path)}`)
      const meta = await getMusicMeta(path)

      musicMeta.push({
        ...meta,
        path,
      })
    }

    await writeFile(metaCache, JSON.stringify(musicMeta), 'utf-8')
  }

  const itunesLib = await parseItunesLibrary('/home/mark/Library.xml')

  console.info(
    `Loaded ${musicMeta.length} nas files and ${itunesLib.tracks.length} iTunes files`
  )

  const filePairs = musicMeta.map((m) => {
    const nas = getBasicMusicMeta(m)

    return {
      nasFile: m,
      itunesFile: itunesLib.tracks.find(
        (itunes) => itunes.artist === nas.artist && itunes.title === nas.title
      ),
    }
  })

  const matchedFiles = filePairs.filter((f) => !!f.itunesFile)
  const unmatchedNasFiles = filePairs
    .filter((f) => !f.itunesFile)
    .map((f) => f.nasFile)
  const unmatchedItunesFiles = itunesLib.tracks.filter((t) =>
    matchedFiles.every((p) => p.itunesFile?.path !== t.path)
  )

  // console.info(
  //   `Matched:\n${Object.entries(matchedFiles[0].nasFile)
  //     .map(([key, val]) => `${key}: ${val}`)
  //     .join('\n')}\nto:\n${Object.entries(matchedFiles[0].itunesFile ?? {})
  //     .map(([key, val]) => `${key}: ${val}`)
  //     .join('\n')}`
  // )

  console.info(`Matched ${matchedFiles.length} files`)
  console.info(
    `Failed to match ${
      unmatchedNasFiles.length + unmatchedItunesFiles.length
    } files`
  )

  console.info('Unmatched NAS files:')
  console.table(
    unmatchedNasFiles
      .map((f) => {
        const meta = getBasicMusicMeta(f)

        return {
          title: meta.title,
          artist: meta.artist,
          genre: meta.genre,
          path: f.path,
        }
      })
      .sort((f1, f2) =>
        f1.title! < f2.title! ? -1 : f1.title === f2.title ? 0 : 1
      )
  )

  console.info('Unmatched iTunes files:')
  console.table(
    unmatchedItunesFiles
      .map((meta) => ({
        title: meta.title,
        artist: meta.artist,
        genre: meta.genre,
        path: meta.path,
      }))
      .sort((f1, f2) =>
        f1.title < f2.title ? -1 : f1.title === f2.title ? 0 : 1
      )
  )
})
