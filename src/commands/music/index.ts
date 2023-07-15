import { Command } from 'commander'
import { musicOrganiseCommand } from './organise'
import { musicItunesCommand } from './itunes'

export const musicCommand = new Command('music')
  .addCommand(musicOrganiseCommand)
  .addCommand(musicItunesCommand)
