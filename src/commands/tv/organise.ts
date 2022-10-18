import { fixTvFilename } from '@/domain/tv/fixTvFilename'
import { Argument, Command } from 'commander'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { fixExternalSubtitlesFilename } from '@/domain/subtitles/fixSubtitlesFilename'

export const tvOrganiseCommand = new Command('organise')
  .addArgument(new Argument('<glob>', 'the glob pattern to files to organise'))
  .action(async (glob: string) => {
    const allFiles = await resolveWslGlob(glob)

    let idx = 1
    for (const filePath of allFiles) {
      console.log(`Organising ${idx} of ${allFiles.length}`)

      if (pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        const newPath = await fixTvFilename(filePath)
        console.log(`Moved\n${filePath}\nto\n${newPath}\n`)

        await fixExternalSubtitlesFilename(filePath, newPath)
        console.log(`Moved subtitles for\n${filePath}\n`)
      } else {
        console.log(`Skipped\n${filePath}\n as it's not a video file`)
      }

      idx++
    }
  })
