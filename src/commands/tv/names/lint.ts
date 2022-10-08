import { Command } from 'commander'
import { askUserForInput } from '../../../lib/console'
import { getAllFilesOfTypeInDir } from '../../../lib/files/crawler'
import { VIDEO_FILE_EXTENSIONS } from '../../../lib/files/exts'
import { fixTvEpisodePath } from '../../../lib/files/tv/setTvFileName'

export const tvNamesLintCommand = new Command('lint').action(async () => {
  const dir = await askUserForInput('Directory: ')

  const allFiles = await getAllFilesOfTypeInDir(dir, VIDEO_FILE_EXTENSIONS)

  let idx = 1
  for (const file of allFiles) {
    console.log(`Fixing ${idx} of ${allFiles.length}`)
    await fixTvEpisodePath(file.path)

    idx++
  }
})
