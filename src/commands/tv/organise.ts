import { resolveGlob } from '@/lib/fs/crawler'
import { fixWindowsPath } from '@/lib/paths/fixWindowsPath'
import { fixTvFilename } from '@/domain/tv/fixFilename'
import { Argument, Command } from 'commander'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import {
  SUBTITLE_FILE_EXTENSIONS,
  VIDEO_FILE_EXTENSIONS,
} from '@/lib/paths/exts'

export const tvOrganiseCommand = new Command('organise')
  .addArgument(new Argument('<glob>', 'the glob pattern to files to organise'))
  .action(async (glob) => {
    glob = fixWindowsPath(glob)

    const allFiles = await resolveGlob(glob)

    let idx = 1
    for (const filePath of allFiles) {
      console.log(`Organising ${idx} of ${allFiles.length}`)

      if (pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        const newPath = await fixTvFilename(filePath)
        console.log(`Moved\n${filePath}\nto\n${newPath}\n`)
      } else if (pathMatchesExtension(filePath, SUBTITLE_FILE_EXTENSIONS)) {
        // TODO match with relevant episode file, and repeat mapping operation
        const newPath = await fixTvFilename(filePath)
        console.log(`Moved\n${filePath}\nto\n${newPath}\n`)
      } else {
        console.log(`Skipped\n${filePath}\n as it's not a video file`)
      }

      idx++
    }
  })
