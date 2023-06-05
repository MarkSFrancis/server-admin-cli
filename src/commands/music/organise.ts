import { Command } from 'commander'
import path, { extname } from 'path'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { SpecialFolders } from '@/lib/paths/SpeciaFolders'
import { convertPathToGlob } from '@/lib/fs/glob/convertPathToGlob'
import { getBasicMusicMeta, getMusicMeta } from '@/domain/music/getMusicMeta'
import { getMusicDestinationFilename } from '@/domain/music/getMusicDestinationFilename'
import { moveFile } from '@/lib/fs/moveFile'

// https://support.plex.tv/articles/200265296-adding-music-media-from-folders/#toc-0

// Content should have each artist in their own directory, with each album as a separate subdirectory within it.
// `Music/ArtistName/AlbumName/TrackNumber - TrackName.ext`

export const musicLibraryOrganiseCommand = new Command('organise').action(
  async () => {
    const musicLibraryPath = SpecialFolders.Music
    const allFiles = await resolveWslGlob(
      `${convertPathToGlob(musicLibraryPath)}/Compilations/*`
    )

    let idx = 1
    for (const filePath of allFiles) {
      if (extname(filePath) === '') {
        // Is probably a folder
        continue
      }

      console.info(`Analysing ${idx} of ${allFiles.length}:\n${filePath}`)

      if (
        path.dirname(filePath).split(path.sep).slice(-1).pop() !==
        'Compilations'
      ) {
        console.info('Not in compilations folder, skipping')
        continue
      }

      const meta = getBasicMusicMeta(await getMusicMeta(filePath))
      if (!meta) {
        console.error('Failed to parse meta')
      } else {
        const destination = getMusicDestinationFilename(
          SpecialFolders.Music,
          meta,
          extname(filePath)
        )
        console.info('Destination:', destination)

        await moveFile(filePath, destination, {
          overwrite: false,
          renameOnDuplicate: true,
        })
      }

      idx++
      console.info('')
    }
  }
)
