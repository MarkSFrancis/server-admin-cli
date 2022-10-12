import { consolePrompt } from '@/lib/console/askUserForInput'
import { program } from 'commander'
import { crawlCommand } from './crawl'
import { docsCommand } from './docs'
import { tvCommand } from './tv'

program.addCommand(docsCommand)
program.addCommand(tvCommand)
program.addCommand(crawlCommand)

program.action(async () => {
  const response = await consolePrompt('What is your name?')

  console.log(`Your name is ${response}`)
})

program.parse()
