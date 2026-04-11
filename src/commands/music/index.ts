import { Command } from 'commander';
import { musicOrganiseCommand } from './organise.ts';
import { musicItunesCommand } from './itunes.ts';
import { musicSyncCommand } from './sync.ts';

export const musicCommand = new Command('music')
  .addCommand(musicOrganiseCommand)
  .addCommand(musicItunesCommand)
  .addCommand(musicSyncCommand);
