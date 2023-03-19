import { VIDEO_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import { Command, Option } from 'commander'
import { basename } from 'path'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { getSubtitlesForMedia } from '@/domain/subtitles/getSubtitlesForMedia'
import { promptForMediaGlob } from '@/lib/console/promptForMediaGlob'

export const subtitlesReviewCommand = new Command('review')
  .addOption(
    new Option(
      '-g, --glob <string>',
      'the glob pattern to media files to review the subtitles for'
    )
  )
  .action(async (options: { glob?: string }) => {
    const glob = options.glob ?? (await promptForMediaGlob())
    const allFiles = await resolveWslGlob(glob)

    let idx = 1
    for (const filePath of allFiles) {
      console.info(
        `Reviewing subtitles for ${basename(filePath)} (${idx} of ${
          allFiles.length
        })`
      )

      if (!pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        console.info(`Skipped\n${filePath}\n as it's not a video file`)
      } else {
        console.info(`Analysing:\n${filePath}`)

        const subtitles = await getSubtitlesForMedia(filePath)

        if (subtitles.length === 0) {
          console.info('Subtitles not found')
        } else {
          const internalSubs = subtitles.filter(
            (s) => s.streamContainerPath === filePath
          )
          const externalSubs = subtitles.filter(
            (s) => s.streamContainerPath !== filePath
          )

          console.info(
            `${internalSubs.length} internal and ${externalSubs.length} external subs found`
          )

          for (const sub of subtitles) {
            console.info(JSON.stringify(sub, null, 2))
          }
        }
      }

      idx++
      console.info('')
    }
  })
