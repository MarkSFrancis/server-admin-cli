import { Command } from 'commander'
import { tvNamesCommand } from './names'

export const tvCommand = new Command('tv').addCommand(tvNamesCommand)
