import { Command } from 'commander'
import { subtitlesStatusCommand } from './status'

export const subtitlesCommand = new Command('subtitles').addCommand(
  subtitlesStatusCommand
)
