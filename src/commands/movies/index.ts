import { Command } from 'commander'
import { moviesOrganiseCommand } from './organise'

export const moviesCommand = new Command('movies').addCommand(
  moviesOrganiseCommand
)
