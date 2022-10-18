import { VIDEO_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import { Argument, Command } from 'commander'
import { basename } from 'path'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { getSubtitlesForMedia } from '@/domain/subtitles/getSubtitles'

export const subtitlesStatusCommand = new Command('status')
  .addArgument(
    new Argument(
      '<glob>',
      'the glob pattern to media files to review the subtitles for'
    )
  )
  .action(async (glob: string) => {
    const allFiles = await resolveWslGlob(glob)

    let idx = 1
    for (const filePath of allFiles) {
      console.log(
        `Getting status of ${basename(filePath)} (${idx} of ${allFiles.length})`
      )

      if (!pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        console.log(`Skipped\n${filePath}\n as it's not a video file`)
      } else {
        console.log(`Analysing:\n${filePath}`)

        const subtitles = await getSubtitlesForMedia(filePath)

        if (subtitles.length === 0) {
          console.log(`Subtitles not found`)
        } else {
          const internalSubs = subtitles.filter(
            (s) => s.streamContainerPath === filePath
          )
          const externalSubs = subtitles.filter(
            (s) => s.streamContainerPath !== filePath
          )

          console.log(
            `${internalSubs.length} internal and ${externalSubs.length} external subs found`
          )

          for (const sub of subtitles) {
            console.log(JSON.stringify(sub, null, 2))
          }
        }
      }

      idx++
      console.log('')
    }
  })
