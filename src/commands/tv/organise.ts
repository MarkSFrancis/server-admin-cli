import { fixTvFilename } from '@/domain/tv/fixTvFilename'
import { Command, Option } from 'commander'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { fixExternalSubtitlesFilename } from '@/domain/subtitles/fixSubtitlesFilename'
import { promptForMediaGlob } from '@/lib/console/promptUserForPath'

export const tvOrganiseCommand = new Command('organise')
  .addOption(
    new Option('-g, --glob <string>', 'the glob pattern to files to organise')
  )
  .action(async (options: { glob?: string }) => {
    const glob = options.glob ?? (await promptForMediaGlob())
    const allFiles = await resolveWslGlob(glob)

    console.info(
      `${allFiles.length} files found matching the specified pattern`
    )

    let idx = 1
    for (const filePath of allFiles) {
      console.info(`Organising ${idx} of ${allFiles.length}`)

      if (pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        const newPath = await fixTvFilename(filePath)
        console.info(`Moved\n${filePath}\nto\n${newPath}\n`)

        await fixExternalSubtitlesFilename(filePath, newPath)
        console.info(`Moved subtitles for\n${filePath}\n`)
      } else {
        console.info(`Skipped\n${filePath}\n as it's not a video file`)
      }

      idx++
    }
  })
