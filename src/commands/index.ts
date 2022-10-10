import { program } from 'commander'
import { docsCommand } from './docs'
import { tvCommand } from './tv'

program.addCommand(docsCommand)
program.addCommand(tvCommand)

program.parse()
