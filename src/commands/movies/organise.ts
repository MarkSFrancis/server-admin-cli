import { Command, Option } from 'commander';
import {
  VIDEO_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '@/lib/paths/exts';
import { resolveWslGlob } from '@/lib/fs/glob/resolveWslGlob';
import { fixExternalSubtitlesFilename } from '@/domain/subtitles/fixSubtitlesFilename';
import { promptForMediaGlob } from '@/lib/console/promptForMediaGlob';
import { getExternalSubtitlesForMovie } from '@/domain/subtitles/getExternalSubtitlesForMovie';

export const moviesOrganiseCommand = new Command('organise')
  .addOption(
    new Option('-g, --glob <string>', 'the glob pattern to files to organise')
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
      console.info(`Organising ${idx} of ${allFiles.length}`);

      const externalSubtitlesPaths =
        await getExternalSubtitlesForMovie(filePath);
      await fixExternalSubtitlesFilename(externalSubtitlesPaths, filePath);
      console.info(`Moved subtitles for\n${filePath}\n`);

      idx++;
    }
  });
