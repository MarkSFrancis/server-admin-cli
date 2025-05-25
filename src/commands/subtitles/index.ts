import { Command } from 'commander';
import { subtitlesReviewCommand } from './review';

export const subtitlesCommand = new Command('subtitles').addCommand(
  subtitlesReviewCommand
);
