import { program } from 'commander'
import { docsCommand } from './docs'
import { sum } from './math'

program.addCommand(docsCommand)

program
  .command('sum')
  .description('add numbers together')
  .argument('<numbers...>', 'numbers to add')
  .action((numbers) => {
    console.log({ numbers })
    console.log(`Sum: ${sum(...numbers.map(Number))}`)
  })

program.parse()
