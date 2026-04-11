import { fixTvFilename } from '#/domain/tv/fixTvFilename.ts';
import { Command, Option } from 'commander';
import {
  VIDEO_FILE_EXTENSIONS,
  extensionsToGlobPattern,
} from '#/lib/paths/exts.ts';
import { resolveWslGlob } from '#/lib/fs/glob/resolveWslGlob.ts';
import { fixExternalSubtitlesFilename } from '#/domain/subtitles/fixSubtitlesFilename.ts';
import { promptForMediaGlob } from '#/lib/console/promptForMediaGlob.ts';
import { getExternalSubtitlesForTv } from '#/domain/subtitles/getExternalSubtitlesForTv.ts';

export const tvOrganiseCommand = new Command('organise')
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

      const newPath = await fixTvFilename(filePath);
      console.info(`Moved\n${filePath}\nto\n${newPath}\n`);

      const externalSubtitlesPaths = await getExternalSubtitlesForTv(filePath);
      await fixExternalSubtitlesFilename(externalSubtitlesPaths, newPath);
      console.info(`Moved subtitles for\n${filePath}\n`);

      idx++;
    }
  });
