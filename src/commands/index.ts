import { program } from 'commander'
import { docsCommand } from './docs'
import { sumCommand } from './sum'
import { tvCommand } from './tv'

program.addCommand(docsCommand)
program.addCommand(sumCommand)
program.addCommand(tvCommand)

program.parse()
