import { Argument, Command } from 'commander';
import { parseItunesLibrary } from '@/domain/music/parseItunesLibrary';

export const musicItunesCommand = new Command('itunes')
  .addArgument(
    new Argument('<library>', 'The path to the XML itunes library export')
  )
  .action(async (library) => {
    console.info('Parsing library...');
    const libContents = await parseItunesLibrary(library as string);

    console.info(libContents);
  });
