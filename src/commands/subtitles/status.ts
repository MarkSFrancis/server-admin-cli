import { getExternalSubtitlesForMedia } from '@/domain/subtitles/getExternalSubtitlesForMedia'
import { getInternalSubtitlesFromContainer } from '@/domain/subtitles/getInternalSubtitlesFromContainer'
import { resolveGlob } from '@/lib/fs/crawler'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/paths/exts'
import { pathMatchesExtension } from '@/lib/paths/filterByExtension'
import { fixWindowsPath } from '@/lib/paths/fixWindowsPath'
import { Command, Option } from 'commander'
import { basename } from 'path'

export const subtitlesStatusCommand = new Command('status')
  .addOption(
    new Option(
      '-g, --glob <pattern>',
      'the glob pattern to media files to get the status of'
    ).default(
      `/mnt/z/media/+(tv-series|movies)/**+(${VIDEO_FILE_EXTENSIONS.join('|')})`
    )
  )
  .action(async ({ glob }: { glob: string }) => {
    console.log({ glob })
    glob = fixWindowsPath(glob)

    const allFiles = await resolveGlob(glob)

    let idx = 1
    for (const filePath of allFiles) {
      console.log(
        `Getting status of ${basename(filePath)} (${idx} of ${allFiles.length})`
      )

      if (!pathMatchesExtension(filePath, VIDEO_FILE_EXTENSIONS)) {
        console.log(`Skipped\n${filePath}\n as it's not a video file`)
      } else {
        console.log(`Analysing:\n${filePath}`)

        const internalSubs = await getInternalSubtitlesFromContainer(filePath)
        const externalSubs = await getExternalSubtitlesForMedia(filePath)

        if (internalSubs.length === 0 && externalSubs.length === 0) {
          console.log(`Subtitles not found`)
        } else {
          console.log(
            `${internalSubs.length} internal and ${externalSubs.length} external subs found`
          )

          for (const sub of internalSubs) {
            console.log(JSON.stringify(sub, null, 2))
          }
          for (const sub of externalSubs) {
            console.log(JSON.stringify(sub, null, 2))
          }
        }
      }

      idx++
      console.log('')
    }
  })
