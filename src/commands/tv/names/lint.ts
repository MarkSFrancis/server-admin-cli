import { Argument, Command, Option } from 'commander'
import { getAllFilesOfTypeInDir } from '@/lib/files/crawler'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/files/exts'
import { fixWindowsPath } from '@/lib/files/fixWindownPath'
import {
  fixTvEpisodePath,
  getFixedTvEpisodePath,
} from '@/lib/files/tv/setTvFileName'

export const tvNamesLintCommand = new Command('lint')
  .addArgument(
    new Argument('<directory>', 'the directory to lint within recursively')
  )
  .addOption(new Option('-f, --fix', 'write recommended changes to the disk'))
  .action(async (directory: string, options: { fix?: boolean }) => {
    directory = fixWindowsPath(directory)

    const allFiles = await getAllFilesOfTypeInDir(
      directory,
      VIDEO_FILE_EXTENSIONS
    )

    let idx = 1
    for (const file of allFiles) {
      console.log(`Linting ${idx} of ${allFiles.length}`)

      const newPath = await getFixedTvEpisodePath(file.path)

      if (newPath !== file.path) {
        if (options.fix) {
          await fixTvEpisodePath(file.path, newPath)

          console.log(`Moved\n${file.path} to\n${newPath}\n`)
        } else {
          console.log(`Path\n${file.path} should be\n${newPath}\n`)
        }
      }

      idx++
    }
  })
