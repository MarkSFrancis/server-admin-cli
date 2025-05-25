import ffmpeg from 'fluent-ffmpeg';
import { runFfmpeg } from './ffmpeg';

export const removeStreamsFromContainer = async (
  path: string,
  trackIndexesToRemove: number[]
) => {
  let command = ffmpeg().input(path).map('0');

  for (const trackIdxToRemove of trackIndexesToRemove) {
    command = command.map(`-0:${trackIdxToRemove}`);
  }

  command = command.addOption('-c', 'copy');

  await runFfmpeg(command);
};
