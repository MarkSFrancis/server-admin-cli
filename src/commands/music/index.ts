import { Command } from 'commander'
import { musicOrganiseCommand } from './organise'
import { musicItunesCommand } from './itunes'
import { musicSyncCommand } from './sync'

export const musicCommand = new Command('music')
  .addCommand(musicOrganiseCommand)
  .addCommand(musicItunesCommand)
  .addCommand(musicSyncCommand)
