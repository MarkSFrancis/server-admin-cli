import { Command } from 'commander'
import { askUserForInput } from '../../lib/console'
import { fixTvEpisodePath } from '../../lib/files/tv/setTvFileName'
import { getAllFilesOfTypeInDir } from '../../lib/files/crawler'
import { VIDEO_FILE_EXTENSIONS } from '../../lib/files/exts'

export const tvNamesCommand = new Command('names').action(async () => {
  const dir = await askUserForInput('Directory: ')

  const allFiles = await getAllFilesOfTypeInDir(dir, VIDEO_FILE_EXTENSIONS)

  let idx = 1
  for (const file of allFiles) {
    console.log(`Fixing ${idx} of ${allFiles.length}`)
    await fixTvEpisodePath(file.path)

    idx++
  }
})
