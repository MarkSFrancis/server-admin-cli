import { Argument, Command, Option } from 'commander'
import { filterByExtension } from '@/lib/files/crawlerFilter'
import { VIDEO_FILE_EXTENSIONS } from '@/lib/files/exts'
import { fixWindowsPath } from '@/lib/files/fixWindowsPath'
import { getFixedTvEpisodePath } from '@/lib/files/tv/getFixedTvEpisodePath'
import { moveFile } from '@/lib/files/moveFile'
import { getAllFilesInDir } from '@/lib/files/crawler'

export const tvNamesLintCommand = new Command('lint')
  .addArgument(
    new Argument('<directory>', 'the directory to lint within recursively')
  )
  .addOption(new Option('-f, --fix', 'write recommended changes to the disk'))
  .action(async (directory: string, options: { fix?: boolean }) => {
    directory = fixWindowsPath(directory)

    const allFiles = await getAllFilesInDir(directory)
    const allMovieFiles = allFiles.filter(
      filterByExtension(VIDEO_FILE_EXTENSIONS)
    )

    let idx = 1
    for (const file of allMovieFiles) {
      console.log(`Linting ${idx} of ${allMovieFiles.length}`)

      const newPath = await getFixedTvEpisodePath(file.path)

      if (newPath !== file.path) {
        if (options.fix) {
          await moveFile(file.path, newPath, { overwrite: false })

          console.log(`Moved\n${file.path}\nto\n${newPath}\n`)
        } else {
          console.log(`Path\n${file.path}\nshould be\n${newPath}\n`)
        }
      }

      idx++
    }
  })
