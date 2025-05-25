import { Command, Option } from 'commander';
import {
  VIDEO_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '@/lib/paths/exts';
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob';
import { promptForMediaGlob } from '@/lib/console/promptForMediaGlob';
import { getVideoStreamsFromContainer } from '@/lib/media-container/video/getVideoStreamsFromContainer';
import { statSync } from 'fs';
import {
  getHighestResolutionStream,
  isStreamHD,
} from '@/lib/media-container/video/isStreamHD';

export const moviesDetectLowResolutionsCommand = new Command(
  'detect-low-resolutions'
)
  .addOption(
    new Option('-g, --glob <string>', 'the glob pattern to files to scan')
  )
  .action(async (options: { glob?: string }) => {
    const glob = options.glob ?? (await promptForMediaGlob());
    const allFiles = await resolveWslGlob(
      `${glob}${extensionsToGlobPattern(VIDEO_FILE_EXTENSIONS)}`,
      { nodir: true }
    );

    console.info(
      `${allFiles.length} files found matching the specified pattern`
    );

    let idx = 1;
    for (const filePath of allFiles) {
      console.info(`Scanning ${idx} of ${allFiles.length}`);
      console.info(filePath);

      const fileStats = statSync(filePath);
      const fileSizeMB = Math.floor(fileStats.size / (1024 * 1024));
      const bestStream = getHighestResolutionStream(
        await getVideoStreamsFromContainer(filePath)
      );

      let text: string;
      const isHD = isStreamHD(bestStream);
      if (isHD === undefined) {
        text = 'File quality is unknown';
      } else {
        if (isHD) {
          text = 'File is HD';
        } else {
          text = 'File is not HD';
        }
        text += ` (${bestStream?.width ?? '?'}x${bestStream?.height ?? '?'})`;
      }

      console.info(`${text} (${fileSizeMB}MB)`);

      idx++;
    }
  });
