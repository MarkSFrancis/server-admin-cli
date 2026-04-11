import { Command } from 'commander';
import { moviesOrganiseCommand } from './organise.ts';
import { moviesDetectLowResolutionsCommand } from './detectLowResolutions.ts';

export const moviesCommand = new Command('movies')
  .addCommand(moviesOrganiseCommand)
  .addCommand(moviesDetectLowResolutionsCommand);
