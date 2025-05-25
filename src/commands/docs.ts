import { DOCS_BASE_URL } from '@/domain/docs';
import { Command } from 'commander';
import open from 'open';

export const docsCommand = new Command('docs')
  .description('open the docs')
  .action(async () => {
    console.info('Opening docs...');
    await open(DOCS_BASE_URL);
  });
