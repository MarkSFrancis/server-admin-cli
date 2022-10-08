import { Command } from 'commander'
import { tvNamesLintCommand } from './lint'

export const tvNamesCommand = new Command('names').addCommand(
  tvNamesLintCommand
)
