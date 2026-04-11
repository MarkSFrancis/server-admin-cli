import { program } from 'commander';
import { animeCommand } from './anime/index.ts';
import { docsCommand } from './docs.ts';
import { subtitlesCommand } from './subtitles/index.ts';
import { tvCommand } from './tv/index.ts';
import { musicCommand } from './music/index.ts';
import { moviesCommand } from './movies/index.ts';

program.addCommand(docsCommand);
program.addCommand(tvCommand);
program.addCommand(moviesCommand);
program.addCommand(subtitlesCommand);
program.addCommand(animeCommand);
program.addCommand(musicCommand);

program.parse();
