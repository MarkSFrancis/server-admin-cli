import { Command } from 'commander';
import { tvOrganiseCommand } from './organise.ts';
import { tvLanguagesCommand } from './languages/index.ts';

export const tvCommand = new Command('tv')
  .addCommand(tvOrganiseCommand)
  .addCommand(tvLanguagesCommand);
