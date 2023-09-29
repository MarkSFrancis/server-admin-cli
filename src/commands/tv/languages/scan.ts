import { Command, Option } from 'commander'
import {
  VIDEO_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '@/lib/paths/exts'
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob'
import { promptForMediaGlob } from '@/lib/console/promptForMediaGlob'
import { getAudioLanguages } from '@/domain/tv/languages/getAudioLanguages'
import { getSubtitleLanguages } from '@/domain/tv/languages/getSubtitleLanguage'

export const tvLanguagesScanCommand = new Command('scan')
  .addOption(
    new Option('-g, --glob <string>', 'the glob pattern to files to scan')
  )
  .action(async (options: { glob?: string }) => {
    const glob = options.glob ?? (await promptForMediaGlob())
    const allFiles = await resolveWslGlob(
      `${glob}${extensionsToGlobPattern(VIDEO_FILE_EXTENSIONS)}`,
      { nodir: true }
    )

    console.info(
      `${allFiles.length} files found matching the specified pattern`
    )

    let idx = 1
    for (const filePath of allFiles) {
      console.info(`Scanning ${idx} of ${allFiles.length}`)

      console.info(`${filePath}`)
      const languages = await getAudioLanguages(filePath)
      console.info(`Audio languages:\n${languages.join(', ')}`)

      const subs = await getSubtitleLanguages(filePath)
      console.info(`Internal subtitle languages:\n${subs.internal.join(', ')}`)
      console.info(`External subtitle languages:\n${subs.external.join(', ')}`)

      idx++
    }
  })
