import { program } from 'commander'
import { docsCommand } from './docs'
import { subtitlesCommand } from './subtitles'
import { tvCommand } from './tv'

program.addCommand(docsCommand)
program.addCommand(tvCommand)
program.addCommand(subtitlesCommand)

program.parse()
