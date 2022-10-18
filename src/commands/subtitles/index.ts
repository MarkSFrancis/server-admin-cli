import { Command } from 'commander'

export const subtitlesCommand = new Command('subtitles').addCommand(
  subtitlesReviewCommand
)
