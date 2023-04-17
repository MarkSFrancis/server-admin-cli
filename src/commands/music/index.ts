import { Command } from 'commander'
import { musicLibraryOrganiseCommand } from './organise'

export const musicCommand = new Command('music').addCommand(
  musicLibraryOrganiseCommand
)
