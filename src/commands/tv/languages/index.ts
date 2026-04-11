import { Command } from 'commander';
import { tvLanguagesScanCommand } from './scan.ts';

export const tvLanguagesCommand = new Command('languages').addCommand(
  tvLanguagesScanCommand
);
