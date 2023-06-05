import { program } from 'commander'
import { animeCommand } from './anime'
import { docsCommand } from './docs'
import { subtitlesCommand } from './subtitles'
import { tvCommand } from './tv'
import { musicCommand } from './music'
import { moviesCommand } from './movies'

program.addCommand(docsCommand)
program.addCommand(tvCommand)
program.addCommand(moviesCommand)
program.addCommand(subtitlesCommand)
program.addCommand(animeCommand)
program.addCommand(musicCommand)

program.parse()
