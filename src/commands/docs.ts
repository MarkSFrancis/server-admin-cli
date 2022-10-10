import { Command } from 'commander'
import open from 'open'

export const docsCommand = new Command('docs')
  .description('open the docs')
  .action(async () => {
    console.log('Opening docs...')
    await open('https://server-admin-docs.vercel.app/')
  })
