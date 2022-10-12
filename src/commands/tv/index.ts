import { Command } from 'commander'
import { tvOrganiseCommand } from './organise'

export const tvCommand = new Command('tv').addCommand(tvOrganiseCommand)
