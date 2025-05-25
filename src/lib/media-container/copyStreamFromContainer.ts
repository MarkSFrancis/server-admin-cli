import ffmpeg from 'fluent-ffmpeg';
import { runFfmpeg } from './ffmpeg';

export const copyStreamFromContainer = async (
  inputPath: string,
  streamIndex: number,
  outputPath: string
) => {
  const command = ffmpeg()
    .input(inputPath)
    .map(`0:${streamIndex}`)
    .addOptions('-c', 'copy')
    .output(outputPath);

  await runFfmpeg(command);
};
