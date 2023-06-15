import { Command } from 'commander'
import { tvLanguagesScanCommand } from './scan'

export const tvLanguagesCommand = new Command('languages').addCommand(
  tvLanguagesScanCommand
)
