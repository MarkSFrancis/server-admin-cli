import { Command } from 'commander';
import { tvOrganiseCommand } from './organise.ts';
import { tvLanguagesCommand } from './languages/index.ts';
import { tvEstimateEndDateCommand } from './end-date.ts';

export const tvCommand = new Command('tv')
  .addCommand(tvOrganiseCommand)
  .addCommand(tvLanguagesCommand)
  .addCommand(tvEstimateEndDateCommand);
