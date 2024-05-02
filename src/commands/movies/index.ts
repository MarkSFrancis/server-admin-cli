import { Command } from 'commander'
import { moviesOrganiseCommand } from './organise'
import { moviesDetectLowResolutionsCommand } from './detectLowResolutions'

export const moviesCommand = new Command('movies')
  .addCommand(moviesOrganiseCommand)
  .addCommand(moviesDetectLowResolutionsCommand)
