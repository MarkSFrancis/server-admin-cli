import { Argument, Command, Option } from 'commander'
import { getAllFilesOfTypeInDir } from '@/lib/files/crawlerFilter'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/files/exts'
import { fixWindowsPath } from '@/lib/files/fixWindownPath'
import { getFixedTvEpisodePath } from '@/lib/files/tv/getFixedTvEpisodePath'
import { moveFile } from '@/lib/files/moveFile'

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
          await moveFile(file.path, newPath, { overwrite: false })

          console.log(`Moved\n${file.path} to\n${newPath}\n`)
        } else {
          console.log(`Path\n${file.path} should be\n${newPath}\n`)
        }
      }

      idx++
    }
  })
