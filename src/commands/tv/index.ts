import { Command } from 'commander';
import { tvOrganiseCommand } from './organise';
import { tvLanguagesCommand } from './languages';

export const tvCommand = new Command('tv')
  .addCommand(tvOrganiseCommand)
  .addCommand(tvLanguagesCommand);
