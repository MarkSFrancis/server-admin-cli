import {
  VIDEO_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '@/lib/paths/exts';
import { Command, Option } from 'commander';
import { basename } from 'path';
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob';
import { getSubtitlesForTv } from '@/domain/subtitles/getSubtitlesForTv';
import { promptForMediaGlob } from '@/lib/console/promptForMediaGlob';

export const subtitlesReviewCommand = new Command('review')
  .description(
    'reviews the subtitles for TV episodes that match a given glob pattern'
  )
  .addOption(
    new Option(
      '-g, --glob <string>',
      'the glob pattern to media files to review the subtitles for'
    )
  )
  .action(async (options: { glob?: string }) => {
    const glob = options.glob ?? (await promptForMediaGlob());
    const allFiles = await resolveWslGlob(
      `${glob}${extensionsToGlobPattern(VIDEO_FILE_EXTENSIONS)}`,
      { nodir: true }
    );

    let idx = 1;
    for (const filePath of allFiles) {
      console.info(
        `Reviewing subtitles for ${basename(filePath)} (${idx} of ${
          allFiles.length
        })`
      );

      console.info(`Analysing:\n${filePath}`);

      const subtitles = await getSubtitlesForTv(filePath);

      if (subtitles.length === 0) {
        console.info('Subtitles not found');
      } else {
        const internalSubs = subtitles.filter(
          (s) => s.streamContainerPath === filePath
        );
        const externalSubs = subtitles.filter(
          (s) => s.streamContainerPath !== filePath
        );

        console.info(
          `${internalSubs.length} internal and ${externalSubs.length} external subs found`
        );

        for (const sub of subtitles) {
          console.info(JSON.stringify(sub, null, 2));
        }
      }

      idx++;
      console.info('');
    }
  });
