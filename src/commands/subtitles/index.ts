import { Command } from 'commander';
import { subtitlesReviewCommand } from './review.ts';

export const subtitlesCommand = new Command('subtitles').addCommand(
  subtitlesReviewCommand
);
